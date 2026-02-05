import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const OrderSummary = ({
  cartItems,
  getCartTotal,
  isProcessing,
  shippingCost = 0,
}) => {
  const parsePrice = (price) => {
    const parsed = Number.parseFloat(price);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const subtotal = cartItems.reduce((total, item) => {
    const price = parsePrice(item.price);
    return total + price * item.quantity;
  }, 0);

  const totalGst = cartItems.reduce((total, item) => {
    const price = parsePrice(item.price);
    const itemTotal = price * item.quantity;
    const gstPercentage =
      item.gst_percentage !== undefined ? parsePrice(item.gst_percentage) : 18;
    const finalGstPercentage = Number.isNaN(gstPercentage) ? 18 : gstPercentage;
    const itemGst = itemTotal * (finalGstPercentage / 100);
    return total + itemGst;
  }, 0);

  const total = Math.round((subtotal + totalGst + shippingCost) * 100) / 100;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {cartItems.map((item) => {
            const price = parsePrice(item.price);
            const gstPercentage =
              item.gst_percentage !== undefined
                ? parsePrice(item.gst_percentage)
                : 18;
            const finalGstPercentage = Number.isNaN(gstPercentage)
              ? 18
              : gstPercentage;
            const itemSubtotal = price * item.quantity;
            const itemGst = itemSubtotal * (finalGstPercentage / 100);
            const itemTotal = itemSubtotal + itemGst;

            return (
              <div key={item.id} className="flex justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity} @ ₹{price.toFixed(2)}{" "}
                    {finalGstPercentage > 0 && `(+${finalGstPercentage}% GST)`}
                  </p>
                </div>
                <p className="font-medium">₹{itemTotal.toFixed(2)}</p>
              </div>
            );
          })}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total GST</span>
            <span>₹{totalGst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Cost</span>
            <span>
              {shippingCost > 0 ? (
                `₹${shippingCost.toFixed(2)}`
              ) : (
                <span className="text-green-600">Free</span>
              )}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isProcessing}
          className="w-full btn-primary text-lg py-3"
        >
          {isProcessing ? (
            <>
              <div className="loading-spinner mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Order
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
