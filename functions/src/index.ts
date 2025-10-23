import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();
const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adamselectronicgadgets@gmail.com",
    pass: "njdgdehevzgcsdut", 
  },
});

export const sendOrderConfirmationEmail = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap: functions.firestore.DocumentSnapshot, context: functions.EventContext) => {
    const order = snap.data();
    if (!order) return;

    const customerEmail = order.email;
    if (!customerEmail) {
      console.log("⚠️ No email found in order:", context.params.orderId);
      return;
    }

    const orderId = context.params.orderId;
    const name = order.name || "Customer";
    const total = order.total || 0;
    const items = Array.isArray(order.items) ? order.items : [];

    // Format ordered items
    const formattedItems = items
      .map(
        (item: any, index: number) =>
          `${index + 1}. ${item.name || "Item"} - KSh ${(item.price * item.quantity).toLocaleString()}`
      )
      .join("<br>");

    // Handle timestamp/date
    let dateString = "";
    if (order.createdAt?.seconds) {
      dateString = new Date(order.createdAt.seconds * 1000).toLocaleDateString();
    } else if (typeof order.createdAt === "string") {
      dateString = new Date(order.createdAt).toLocaleDateString();
    } else {
      dateString = new Date().toLocaleDateString();
    }

    // Email
    const mailOptions = {
      from: "Adams Electronic <adamselectronicgadgets@gmail.com>",
      to: customerEmail,
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1a73e8;">Adams Electronic</h2>
          <p>Hi ${name},</p>
          <p>Your order has been received on <strong>${dateString}</strong>.</p>

          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Items:</strong><br>${formattedItems || "No items listed"}</p>
          <p><strong>Total:</strong> KSh ${total.toLocaleString()}</p>

          <h4>Payment</h4>
          <p>Business Number: <strong>247247</strong><br>
          Account Number: <strong>0700056557</strong></p>

          <p>We'll confirm once your payment is received.</p>
          <br>
          <p>Thank you,<br><strong>Adams Electronic</strong></p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Confirmation email sent to ${customerEmail}`);
    } catch (error) {
      console.error("❌ Error sending email:", error);
    }
  });
