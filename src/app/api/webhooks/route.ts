import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser } from "~/server/clerkweb/user";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  // Log the webhook
  // * For now (Clerk has typescript support https://clerk.com/docs/integrations/webhooks)
  switch (eventType) {
    case "user.created":
      const email = evt.data.email_addresses[0]?.email_address!;
      try {
        if (!id) throw new Error("No ID found");
        await createUser(email, id);
      } catch (err) {
        console.error("Error creating user:", err);
        return new Response("Error occured", {
          status: 500,
        });
      }
      break;
    case "user.deleted":
      console.log("User Deleted");
      // await deleteUser(evt.data.id);
      break;
    case "user.updated":
      console.log("User Updated");
      break;
    default:
      console.log("Unknown event type");
  }
  // * In the future
  // Role Created
  // Role Deleted
  // Role Updated
  // Permission Created
  // Permission Deleted
  // Permission Updated
  // Sms Created

  // console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  // console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}
