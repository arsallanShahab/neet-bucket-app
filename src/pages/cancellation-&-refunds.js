import Heading from "@/components/Heading";

const CancellationAndRefunds = () => {
  return (
    <div className="mx-auto max-w-4xl p-5 sm:p-10">
      <Heading>Cancellation & Refunds</Heading>
      <p className="pb-10 text-lg text-slate-950 sm:pb-20">
        Neet Bucket believes in helping its customers as far as possible, and
        has therefore a liberal cancellation policy. Under this policy:
        <br />
        <br />
        Cancellations will be considered only if the request is made immediately
        after placing the order. However, the cancellation request may not be
        entertained if the orders have been communicated to the
        vendors/merchants and they have initiated the process of shipping them.
        <br />
        <br />
        Neet Bucket does not accept cancellation requests for perishable items
        like flowers, eatables etc. However, refund/replacement can be made if
        the customer establishes that the quality of product delivered is not
        good.
        <br />
        <br /> In case of receipt of damaged or defective items please report
        the same to our Customer Service team. The request will, however, be
        entertained once the merchant has checked and determined the same at his
        own end. This should be reported within 2 days of receipt of the
        products.
        <br />
        <br /> In case you feel that the product received is not as shown on the
        site or as per your expectations, you must bring it to the notice of our
        customer service within 2 days of receiving the product. The Customer
        Service Team after looking into your complaint will take an appropriate
        decision.
        <br />
        <br /> In case of complaints regarding products that come with a
        warranty from manufacturers, please refer the issue to them.
        <br />
        <br /> In case of any Refunds approved by the Neet Bucket, it’ll take
        6-8 days for the refund to be processed to the end customer.
      </p>
    </div>
  );
};

export default CancellationAndRefunds;
