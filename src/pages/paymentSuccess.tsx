import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

export const PaymentSuccess = () => {
  const router = useRouter();
  const sessionId = router.query.session_id as string;

  const { data, error } = api.stripeSession.get.useQuery(
    {
      sessionId: sessionId,
    },
    {
      enabled: router.isReady,
    }
  );
  if (error) {
    return <div>Something went wrong</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Thanks <span>{data.customer_details?.name}</span>!
      </h1>
      <h2>Your payment was successful</h2>
    </div>
  );
};

export default PaymentSuccess;

// {
//   "id": "cs_test_a1zuH7cT4UZL9NePudhfXWWaB8iBQVo0mBSdEptG6gI56I8aF3hHw0J948",
//   "object": "checkout.session",
//   "after_expiration": null,
//   "allow_promotion_codes": null,
//   "amount_subtotal": 900,
//   "amount_total": 900,
//   "automatic_tax": {
//       "enabled": false,
//       "status": null
//   },
//   "billing_address_collection": null,
//   "cancel_url": "http://localhost:3000/pricing",
//   "client_reference_id": null,
//   "consent": null,
//   "consent_collection": null,
//   "created": 1684942273,
//   "currency": "usd",
//   "currency_conversion": null,
//   "custom_fields": [],
//   "custom_text": {
//       "shipping_address": null,
//       "submit": null
//   },
//   "customer": "cus_NxE7cEuLY9vb6y",
//   "customer_creation": "always",
//   "customer_details": {
//       "address": {
//           "city": null,
//           "country": "FR",
//           "line1": null,
//           "line2": null,
//           "postal_code": null,
//           "state": null
//       },
//       "email": "aldous.scales@gmail.com",
//       "name": "Aldous Scales",
//       "phone": null,
//       "tax_exempt": "none",
//       "tax_ids": []
//   },
//   "customer_email": null,
//   "expires_at": 1685028673,
//   "invoice": "in_1NBJf4ESKSuFghN48oBSaE8b",
//   "invoice_creation": null,
//   "livemode": false,
//   "locale": null,
//   "metadata": {},
//   "mode": "subscription",
//   "payment_intent": null,
//   "payment_link": null,
//   "payment_method_collection": "always",
//   "payment_method_options": null,
//   "payment_method_types": [
//       "card"
//   ],
//   "payment_status": "paid",
//   "phone_number_collection": {
//       "enabled": false
//   },
//   "recovered_from": null,
//   "setup_intent": null,
//   "shipping_address_collection": null,
//   "shipping_cost": null,
//   "shipping_details": null,
//   "shipping_options": [],
//   "status": "complete",
//   "submit_type": null,
//   "subscription": "sub_1NBJf4ESKSuFghN42P9XgXYs",
//   "success_url": "http://localhost:3000/paymentSuccessful?session_id={CHECKOUT_SESSION_ID}",
//   "total_details": {
//       "amount_discount": 0,
//       "amount_shipping": 0,
//       "amount_tax": 0
//   },
//   "url": null
// }
