import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ArrowLeft,
  Download,
  Star,
  MessageSquare,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { firebaseService } from "@/lib/firebaseService";
import { useAuth } from "@/contexts/FirebaseAuthContext";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    loadOrderDetails();

    const interval = setInterval(() => {
      loadOrderDetails();
    }, 30000);

    return () => clearInterval(interval);
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const orderResponse = await firebaseService.getOrderById(orderId);

      if (orderResponse.success) {
        setOrder(orderResponse.data);

        const feedbackResponse =
          await firebaseService.getOrderFeedback(orderId);
        if (feedbackResponse.success) {
          setFeedback(feedbackResponse.data);
        }
      } else {
        toast({
          title: "Error",
          description: "Order not found.",
          variant: "destructive",
        });
        navigate("/order-history");
      }
    } catch (error) {
      console.error("Failed to load order:", error);
      toast({
        title: "Error",
        description: "Failed to load order details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmittingFeedback(true);
      const response = await firebaseService.submitFeedback({
        order_id: orderId,
        user_id: user.uid,
        rating,
        feedback: feedbackText,
        customer_name: order.shipping_name || user.displayName || "Customer",
        order_total: order.total_amount,
      });

      if (response.success) {
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your feedback!",
        });
        setShowFeedbackForm(false);
        loadOrderDetails();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback.",
        variant: "destructive",
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!order) return;

    const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Invoice - Order #${orderId}</title>

        <style>
            @page {
                size: A4 portrait;
                margin: 0;
            }

            body {
                font-family: "Segoe UI", Arial, sans-serif;
                background: #f3f4f6;
                margin: 0;
                padding: 0;
            }

            .page {
                width: 210mm;
                min-height: 297mm;
                background: white;
                padding: 20mm;
                margin: auto;
                box-sizing: border-box;
                border: 1px solid #e5e7eb;
            }

            /* ---------- HEADER ---------- */
            .header {
                text-align: center;
                padding-bottom: 15px;
                border-bottom: 3px solid #373086;
            }

            .logo {
                width: 85px;
                height: 85px;
                border-radius: 14px;
                margin-bottom: 10px;
            }

            .company-name {
                font-size: 30px;
                font-weight: 700;
                color: #373086;
                letter-spacing: 1px;
            }

            .company-info {
                color: #555;
                font-size: 13px;
                margin-top: 5px;
                line-height: 1.5;
            }

            /* ---------- TITLES ---------- */
            .invoice-title {
                margin-top: 25px;
                font-size: 22px;
                font-weight: 700;
                text-align: center;
                color: #111827;
            }

            /* ---------- INFO BLOCKS ---------- */
            .info-section {
                display: flex;
                justify-content: space-between;
                margin-top: 25px;
                margin-bottom: 30px;
            }

            .info-block {
                width: 48%;
            }

            .info-block h3 {
                font-size: 15px;
                color: #373086;
                margin-bottom: 8px;
                padding-bottom: 5px;
                border-bottom: 2px solid #373086;
            }

            .info-block p {
                font-size: 13px;
                margin: 4px 0;
            }

            /* ---------- TABLE ---------- */
            table {
                width: 100%;
                border-collapse: collapse;
                background: white;
                margin-top: 10px;
                font-size: 13px;
            }

            th {
                background: #373086;
                color: white;
                padding: 10px;
                font-weight: 600;
                text-align: left;
                font-size: 13px;
            }

            td {
                padding: 10px 12px;
                border-bottom: 1px solid #e5e7eb;
                vertical-align: top;
            }

            .text-right { text-align: right; }

            /* ---------- TOTALS BOX ---------- */
            .totals-wrapper {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                margin-top: 20px;
            }

            .totals-box {
                width: 320px;
                padding: 15px;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                background: #f9fafb;
            }

            .totals-row {
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
                font-size: 14px;
                color: #333;
            }

            .totals-row.final {
                font-size: 18px;
                font-weight: bold;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 3px solid #373086;
                color: #373086;
            }

            /* ---------- FOOTER ---------- */
            .footer {
                margin-top: 35px;
                text-align: center;
                color: #777;
                font-size: 12px;
                border-top: 2px solid #e5e7eb;
                padding-top: 12px;
            }

            .payment-badge {
                padding: 4px 10px;
                border-radius: 6px;
                font-weight: 700;
                font-size: 12px;
            }

            .paid { background: #dcfce7; color: #166534; }

            .status-badge {
                padding: 4px 10px;
                border-radius: 6px;
                font-weight: 700;
                text-transform: capitalize;
                background: #e0f2fe;
                color: #0369a1;
                font-size: 12px;
            }
        </style>
    </head>

    <body>
    <div class="page">

        <!-- HEADER -->
        <div class="header">
            <img src="/favicon.ico" alt="Company Logo" class="logo" />
            <div class="company-name">SR MEDICAL SYSTEM</div>
            <div class="company-info">
                GSTIN: <strong>33APGPS4675G2ZL</strong><br>
                No:18, Bajanai Koil Street, Rajakilpakkam, Chennai – 600073, Tamil Nadu, India
            </div>
        </div>

        <div class="invoice-title">TAX INVOICE</div>

        <!-- INFO -->
        <div class="info-section">
            <div class="info-block">
                <h3>Invoice Details</h3>
                <p><strong>Invoice No:</strong> INV-${orderId.substring(0, 8).toUpperCase()}</p>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Date:</strong> ${new Date(
                  order.created_at,
                ).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
                <p><strong>Payment:</strong> <span class="payment-badge paid">PAID</span></p>
                <p><strong>Status:</strong> <span class="status-badge">${(order.status || "confirmed").toUpperCase()}</span></p>
            </div>

            <div class="info-block">
                <h3>Shipping Address</h3>
                <p><strong>${order.shipping_name || order.shippingAddress?.name || "Customer"}</strong></p>
                <p>${order.shipping_address || order.shippingAddress?.address || ""}</p>
                <p>${order.shipping_city || order.shippingAddress?.city || ""},
                   ${order.shipping_state || order.shippingAddress?.state || ""} -
                   ${order.shipping_pincode || order.shippingAddress?.pincode || ""}</p>
                <p><strong>Phone:</strong> ${order.shipping_phone || order.shippingAddress?.phone || ""}</p>
                ${order.email ? `<p><strong>Email:</strong> ${order.email}</p>` : ""}
            </div>
        </div>

        <!-- ITEM TABLE -->
        <table>
            <thead>
                <tr>
                    <th style="width: 40%;">Item Description</th>
                    <th>Qty</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${
                  order.items
                    ? order.items
                        .map(
                          (item) => `
                    <tr>
                        <td><strong>${item.product_name || item.name}</strong></td>
                        <td>${item.hsn || "—"}</td>
                        <td>${item.quantity}</td>
                        <td class="text-right">₹${parseFloat(item.price).toFixed(2)}</td>
                        <td class="text-right">₹${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>`,
                        )
                        .join("")
                    : ""
                }
            </tbody>
        </table>

        <!-- TOTALS -->
        <div class="totals-wrapper">
            <div class="totals-box">
                <div class="totals-row">
                    <span>Subtotal:</span>
                    <span>₹${parseFloat(order.subtotal || 0).toFixed(2)}</span>
                </div>

                ${
                  order.cgst
                    ? `
                <div class="totals-row"><span>CGST (9%):</span><span>₹${order.cgst}</span></div>
                <div class="totals-row"><span>SGST (9%):</span><span>₹${order.sgst}</span></div>`
                    : order.igst
                      ? `<div class="totals-row"><span>IGST (18%):</span><span>₹${order.igst}</span></div>`
                      : ""
                }

                <div class="totals-row">
                    <span>Shipping:</span>
                    <span>₹${parseFloat(order.shipping_cost || 0).toFixed(2)}</span>
                </div>

                <div class="totals-row final">
                    <span>Grand Total:</span>
                    <span>₹${parseFloat(order.total_amount || 0).toFixed(2)}</span>
                </div>
            </div>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p><strong>Thank you for your purchase!</strong></p>
            <p>Contact: info.srmedicalsystem@gmail.com | +91 72000 25642</p>
            <p style="margin-top: 6px; font-size: 11px;">This is a computer-generated invoice and does not require a signature.</p>
        </div>

    </div>
    </body>
    </html>
    `;

    const blob = new Blob([invoiceHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${orderId}.html`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Invoice Downloaded",
      description: "Open the HTML file in a browser to print or save as PDF.",
    });
  };

  const getStatusSteps = () => {
    const steps = [
      { status: "pending", label: "Order Placed", icon: Clock },
      { status: "confirmed", label: "Confirmed", icon: CheckCircle },
      { status: "processing", label: "Processing", icon: Package },
      { status: "shipped", label: "Shipped", icon: Truck },
      { status: "out_for_delivery", label: "Out for Delivery", icon: Truck },
      { status: "delivered", label: "Delivered", icon: CheckCircle },
    ];

    const currentStatusIndex = steps.findIndex(
      (step) => step.status === order?.status,
    );

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStatusIndex,
      active: index === currentStatusIndex,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist.
          </p>
          <Link to="/order-history">
            <Button>View Order History</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <>
      <Helmet>
        <title>Order Details - {orderId} | SR Medical System</title>
        <meta
          name="description"
          content="View your order details, track delivery status, and provide feedback."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <Link to="/order-history">
                <Button variant="outline" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
              <Button
                onClick={handleDownloadInvoice}
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">
                      Order #{orderId.substring(0, 8).toUpperCase()}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Placed on{" "}
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge
                    className="w-fit"
                    variant={
                      order.status === "delivered"
                        ? "success"
                        : order.status === "cancelled"
                          ? "destructive"
                          : "default"
                    }
                  >
                    <span className="capitalize">
                      {(order.status || "pending").replace("_", " ")}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-6">Order Status</h3>
                  <div className="relative">
                    <div className="hidden sm:block absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{
                          width: `${((statusSteps.filter((s) => s.completed).length - 1) / (statusSteps.length - 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 sm:gap-2 relative">
                      {statusSteps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                          <div
                            key={step.status}
                            className="flex flex-col items-center text-center"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                                step.completed
                                  ? "bg-primary text-white"
                                  : "bg-gray-200 text-gray-400"
                              } ${step.active ? "ring-4 ring-primary/20" : ""}`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <p
                              className={`text-xs sm:text-sm font-medium ${
                                step.completed
                                  ? "text-gray-900"
                                  : "text-gray-500"
                              }`}
                            >
                              {step.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {order.items &&
                        order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={
                                item.image ||
                                "https://images.unsplash.com/photo-1658204212985-e0126040f88f"
                              }
                              alt={item.product_name || item.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {item.product_name || item.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                              <p className="text-sm font-medium text-primary">
                                ₹{item.price.toFixed(2)} each
                              </p>
                            </div>
                            <p className="font-bold text-gray-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t pt-4 space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span>
                          ₹{parseFloat(order.subtotal || 0).toFixed(2)}
                        </span>
                      </div>
                      {order.gst_amount && order.gst_amount > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>GST ({order.gst_percentage || 18}%):</span>
                          <span>
                            ₹{parseFloat(order.gst_amount).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping:</span>
                        <span>
                          ₹{parseFloat(order.shipping_cost || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2">
                        <span>Total:</span>
                        <span>
                          ₹{parseFloat(order.total_amount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-primary" />
                        Delivery Address
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {(() => {
                          const addr =
                            typeof order.shipping_address === "object"
                              ? order.shipping_address
                              : (typeof order.shippingAddress === "object"
                                  ? order.shippingAddress
                                  : {});
                          const name =
                            addr?.name || order.shipping_name || "N/A";
                          const address =
                            addr?.address || order.shipping_address_string || "N/A";
                          const city = order.shipping_city || addr?.city || "";
                          const state =
                            order.shipping_state || addr?.state || "";
                          const pincode =
                            order.shipping_pincode || addr?.pincode || "";
                          const phone =
                            order.shipping_phone ||
                            addr?.phone ||
                            order.phone ||
                            "N/A";
                          return (
                            <>
                              <p className="font-medium text-gray-900">
                                {String(name)}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {String(address)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {String(city)}
                                {city && state ? ", " : ""}
                                {String(state)}
                                {(city || state) && pincode ? " - " : ""}
                                {String(pincode)}
                              </p>
                              <div className="mt-3 space-y-1">
                                <p className="text-sm text-gray-600 flex items-center">
                                  <Phone className="w-4 h-4 mr-2" />
                                  {String(phone)}
                                </p>
                                {order.email && (
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {String(order.email)}
                                  </p>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {order.payment_id && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Payment Information
                        </h3>
                        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Payment Method:
                            </span>
                            <span className="text-sm font-medium">
                              Razorpay
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Payment Status:
                            </span>
                            <Badge className="bg-green-100 text-green-800">
                              Completed
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Payment ID:
                            </span>
                            <span className="text-xs font-mono">
                              {order.payment_id.substring(0, 20)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {order.status === "delivered" &&
                      !feedback &&
                      !showFeedbackForm && (
                        <div>
                          <Button
                            onClick={() => setShowFeedbackForm(true)}
                            className="w-full flex items-center justify-center"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Rate & Review Order
                          </Button>
                        </div>
                      )}

                    {showFeedbackForm && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Rate Your Experience
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Rating
                            </label>
                            <div className="flex space-x-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="focus:outline-none transition-transform hover:scale-110"
                                >
                                  <Star
                                    className={`w-8 h-8 ${
                                      star <= (hoverRating || rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Your Feedback (Optional)
                            </label>
                            <Textarea
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                              placeholder="Tell us about your experience..."
                              rows={4}
                              className="w-full"
                            />
                          </div>

                          <div className="flex space-x-3">
                            <Button
                              onClick={handleSubmitFeedback}
                              disabled={submittingFeedback}
                              className="flex-1"
                            >
                              {submittingFeedback
                                ? "Submitting..."
                                : "Submit Feedback"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setShowFeedbackForm(false)}
                              disabled={submittingFeedback}
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {feedback && (
                      <Card className="border-ring-primary/20 bg-teal-50">
                        <CardHeader>
                          <CardTitle className="text-lg text-#1e1b4b">
                            Your Feedback
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= feedback.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-sm font-medium text-#1e1b4b">
                              {feedback.rating}/5
                            </span>
                          </div>
                          {feedback.feedback && (
                            <p className="text-sm text-#1e1b4b">
                              {feedback.feedback}
                            </p>
                          )}
                          <p className="text-xs text-primary">
                            Submitted on{" "}
                            {new Date(feedback.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
