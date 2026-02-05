import { firebaseService } from "@/lib/firebaseService";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  RefreshCw,
  ShoppingBag,
  FileDown,
  ChevronRight,
  Activity,
  Calendar,
  CreditCard,
  MapPin,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/FirebaseAuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";

const OrderHistory = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(() => {
      loadOrders(true); // Silent refresh
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [user]);

  const loadOrders = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      const response = await firebaseService.getOrders(user.uid);
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      if (!silent) {
        toast({
          title: "Protocol Failure",
          description: "Could not synchronize order history from the clinical cloud.",
          variant: "destructive",
        });
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await loadOrders(true);
    setRefreshing(false);
    toast({
      title: "Synchronization Complete",
      description: "Order history matrix has been refreshed.",
    });
  };

  const handleReorder = async (order) => {
    try {
      for (const item of order.items) {
        await addToCart(
          {
            id: item.product_id,
            name: item.product_name,
            price: item.price,
          },
          item.quantity,
        );
      }
      toast({
        title: "Supply Chain Restored",
        description: "Clinical items have been re-queued for provisioning.",
      });
    } catch (error) {
      toast({
        title: "Requisition Failed",
        description: "Failed to restock items into the current session.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadInvoice = (orderId) => {
    const order = orders.find((o) => o.id === orderId || o.orderId === orderId);
    if (!order) {
      toast({
        title: "Record Not Found",
        description: "Selected clinical documentation is unavailable.",
        variant: "destructive",
      });
      return;
    }

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
            <img src="/logo.png" alt="Company Logo" class="logo" />
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
                ${(() => {
        const addr =
          typeof order.shippingAddress === "object"
            ? order.shippingAddress
            : {};
        const name = order.shipping_name || addr?.name || "Customer";
        const address = order.shipping_address || addr?.address || "";
        const city = order.shipping_city || addr?.city || "";
        const state = order.shipping_state || addr?.state || "";
        const pincode = order.shipping_pincode || addr?.pincode || "";
        const phone =
          order.shipping_phone || addr?.phone || order.phone || "";
        return `
                    <p><strong>${name}</strong></p>
                    <p>${address}</p>
                    <p>${city}${city && state ? ", " : ""}${state}${(city || state) && pincode ? " - " : ""}${pincode}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    ${order.email ? `<p><strong>Email:</strong> ${order.email}</p>` : ""}
                    `;
      })()}
            </div>
        </div>

        <!-- ITEM TABLE -->
        <table>
            <thead>
                <tr>
                    <th style="width: 40%;">Item Description</th>
                    <th>HSN</th>
                    <th>Qty</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.items
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

                ${order.gst_amount && order.gst_amount > 0
        ? `<div class="totals-row"><span>GST (${order.gst_percentage || 18}%):</span><span>₹${parseFloat(order.gst_amount).toFixed(2)}</span></div>`
        : order.cgst
          ? `<div class="totals-row"><span>CGST (9%):</span><span>₹${parseFloat(order.cgst).toFixed(2)}</span></div>
                           <div class="totals-row"><span>SGST (9%):</span><span>₹${parseFloat(order.sgst).toFixed(2)}</span></div>`
          : order.igst
            ? `<div class="totals-row"><span>IGST (18%):</span><span>₹${parseFloat(order.igst).toFixed(2)}</span></div>`
            : ""
      }

                <div class="totals-row">
                    <span>Shipping:</span>
                    <span>₹${parseFloat(order.shipping_cost || 0).toFixed(2)}</span>
                </div>

                <div class="totals-row final">
                    <span>Grand Total:</span>
                    <span>₹${parseFloat(order.total_amount || order.total || 0).toFixed(2)}</span>
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
      title: "Invoice Extracted",
      description:
        "Clinical billing data has been successfully generated.",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Activity className="w-4 h-4 text-amber-600 animate-pulse" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-blue-600" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200/50";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200/50";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200/50";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200/50";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <Activity className="w-20 h-20 text-[#373086] mb-8 animate-pulse" />
        <p className="text-xl font-black uppercase tracking-tighter text-gray-900">
          Authorization Required
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-[#373086]/10 border-t-[#373086] rounded-full animate-spin" />
          <Activity className="absolute inset-0 m-auto text-[#373086] animate-pulse" size={32} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Supply Timeline | SR Medical System</title>
        <meta
          name="description"
          content="Track your professional medical supply chain and order history."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50/50 pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100/50 text-[#373086] text-[10px] font-black uppercase tracking-widest">
                  <Package size={14} /> Supply Chain Portal
                </div>
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                  Supply Timeline
                </h1>
                <p className="text-gray-500 font-bold max-w-xl">
                  Track your facility's active deployments and review historical clinical provisioning logs.
                </p>
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="h-14 px-8 rounded-2xl border-2 border-gray-100 bg-white hover:bg-gray-50 transition-all font-black uppercase tracking-widest text-[11px] group shadow-sm active:scale-95"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-3 text-[#373086] transition-transform ${refreshing ? "animate-spin" : "group-hover:rotate-180 duration-700"}`}
                />
                Re-Sync Matrix
              </Button>
            </div>

            {orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-100 shadow-inner"
              >
                <div className="w-24 h-24 mx-auto bg-gray-50 rounded-[2rem] flex items-center justify-center mb-8 relative">
                  <ShoppingBag size={48} className="text-gray-300" />
                  <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center animate-bounce">
                    <ChevronRight size={14} className="text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4 uppercase">Timeline Empty</h2>
                <p className="text-gray-500 font-bold max-w-sm mx-auto mb-10 leading-relaxed">
                  No professional supply requisitions found in your current registry.
                </p>
                <Link to="/store">
                  <Button className="h-16 px-10 bg-[#373086] hover:bg-[#1e1b4b] text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:shadow-2xl active:scale-95 flex items-center gap-4 group">
                    Initiate First Procurement <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {orders.map((order, index) => {
                  const orderId = order.orderId || order.id;
                  const status = order.orderStatus || order.status || "pending";

                  return (
                    <motion.div
                      key={orderId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative">
                        <div className="absolute top-0 right-0 p-8 z-10">
                          <Badge className={`px-4 py-2 font-black uppercase tracking-widest text-[9px] rounded-full border shadow-sm ${getStatusColor(status)}`}>
                            <span className="flex items-center gap-2">
                              {getStatusIcon(status)}
                              {status}
                            </span>
                          </Badge>
                        </div>

                        {/* Order Header / Card Header */}
                        <div className="p-10 border-b border-gray-50 bg-gray-50/20">
                          <div className="flex flex-col md:flex-row gap-8">
                            <div className="space-y-2">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#373086]/60">Clinical Requisition</p>
                              <h3 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                                #{orderId.substring(0, 10).toUpperCase()} <span className="opacity-10 text-xl font-black">/</span> {orderId.length > 10 && <span className="text-xs opacity-40 font-mono tracking-tighter">{orderId.substring(10)}</span>}
                              </h3>
                            </div>
                            <div className="md:border-l border-gray-200 md:pl-8 space-y-4">
                              <div className="flex items-center gap-10">
                                <div className="flex items-center gap-3">
                                  <Calendar size={16} className="text-[#373086]/40" />
                                  <div className="text-sm font-bold text-gray-600">
                                    {new Date(order.createdAt?.seconds * 1000 || order.created_at).toLocaleDateString("en-IN", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <CreditCard size={18} className="text-[#373086]/40" />
                                  <div className="text-sm font-bold text-gray-600">
                                    ₹{parseFloat(order.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Content */}
                        <div className="p-10">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Items List */}
                            <div className="lg:col-span-8 space-y-4">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Device Specifications</h4>
                              {order.items && order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-6 p-6 rounded-3xl bg-gray-50/80 border border-gray-100 hover:bg-white hover:shadow-lg hover:scale-[1.01] transition-all group/item">
                                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 flex-shrink-0 group-hover/item:scale-105 transition-transform">
                                    <img
                                      alt={item.product_name}
                                      className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all duration-700"
                                      src="https://images.unsplash.com/photo-1658204212985-e0126040f88f"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-lg font-black text-gray-900 tracking-tight truncate uppercase italic">{item.product_name}</h5>
                                    <div className="flex items-center gap-4 mt-1">
                                      <span className="text-[10px] font-black text-[#373086] uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol: Clinical Standard</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-black text-[#373086] tracking-tighter">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Base Rate</div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Sidebar Details */}
                            <div className="lg:col-span-4 space-y-8">
                              <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#373086] mb-6 inline-flex items-center gap-2">
                                  <MapPin size={12} /> Logistical Hub
                                </h4>
                                {(() => {
                                  const addr = typeof order.shipping_address === "object" ? order.shipping_address : (typeof order.shippingAddress === "object" ? order.shippingAddress : {});
                                  const name = addr?.name || order.shipping_name || "N/A";
                                  const address = addr?.address || order.shipping_address_string || "N/A";
                                  const city = order.shipping_city || addr?.city || "";
                                  const state = order.shipping_state || addr?.state || "";
                                  const pincode = order.shipping_pincode || addr?.pincode || "";

                                  return (
                                    <div className="space-y-1">
                                      <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{String(name)}</p>
                                      <p className="text-xs font-bold text-gray-500 leading-relaxed">{String(address)}</p>
                                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                        {String(city)} {city && state ? " | " : ""} {String(state)} {pincode && " | "} {String(pincode)}
                                      </p>
                                    </div>
                                  );
                                })()}
                              </div>

                              <div className="flex flex-col gap-3">
                                <Link to={`/order-details/${orderId}`} className="w-full">
                                  <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 border-[#373086]/10 text-[#373086] hover:bg-[#373086] hover:text-white transition-all shadow-sm">
                                    Analyze Details <Eye size={16} className="ml-2" />
                                  </Button>
                                </Link>
                                <Button
                                  onClick={() => handleDownloadInvoice(orderId)}
                                  className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-gray-900 hover:bg-black text-white transition-all shadow-xl active:scale-95 group"
                                >
                                  Extract Invoice <FileDown size={16} className="ml-2 group-hover:translate-y-0.5 transition-transform" />
                                </Button>
                                {status !== "delivered" ? (
                                  <Link to={`/track-order/${orderId}`} className="w-full">
                                    <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-[#373086] hover:shadow-[#373086]/20 hover:scale-[1.02] transition-all">
                                      Live Tracking <ChevronRight size={16} className="ml-2" />
                                    </Button>
                                  </Link>
                                ) : (
                                  <Button
                                    onClick={() => handleReorder(order)}
                                    className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 border-green-500 text-green-600 bg-transparent hover:bg-green-50 shadow-sm transition-all"
                                  >
                                    Initiate Re-supply <RefreshCw size={16} className="ml-2" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OrderHistory;
