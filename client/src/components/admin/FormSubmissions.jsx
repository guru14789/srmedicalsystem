import { firebaseService } from '@/lib/firebaseService';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, FileText, Mail, Phone, Building2, Calendar, Eye, Trash2, CheckCircle, Clock, XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const FormSubmissions = () => {
  const [contacts, setContacts] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    setLoading(true);
    try {
      const [contactsRes, quotesRes] = await Promise.all([
        firebaseService.getAllContacts(),
        firebaseService.getAllQuotes()
      ]);
      if (contactsRes.success) {
        setContacts(contactsRes.data || []);
      }
      if (quotesRes.success) {
        setQuotes(quotesRes.data || []);
      }
    } catch (error) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      contacted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig.new;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };
  const handleStatusChange = async (id, newStatus, type) => {
    try {
      const response = type === 'contact'
        ? await firebaseService.updateContactStatus(id, newStatus)
        : await firebaseService.updateQuoteStatus(id, newStatus);
      if (response.success) {
        toast({
          title: "Status updated",
          description: `${type} status updated successfully`,
        });
        loadData();
        setDialogOpen(false);
      } else {
        throw new Error(response.errors?.join(', ') || 'Update failed');
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleDelete = async (id, type) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const response = type === 'contact'
        ? await firebaseService.deleteContact(id)
        : await firebaseService.deleteQuote(id);
      if (response.success) {
        toast({
          title: "Deleted",
          description: `${type} deleted successfully`,
        });
        loadData();
      } else {
        throw new Error(response.errors?.join(', ') || 'Delete failed');
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const viewDetails = (item, type) => {
    setSelectedItem({ ...item, type });
    setDialogOpen(true);
  };
  const formatDate = (dateObj) => {
    if (!dateObj) return 'N/A';
    const date = dateObj.date ? new Date(dateObj.date) : new Date(dateObj);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#373086]"></div>
      </div>
    );
  }
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Form Submissions</h2>
        <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">View and manage all form submissions from your website</p>
      </div>
      <Tabs defaultValue="contacts" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contacts" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Contact Messages</span>
            <span className="sm:hidden">Contact</span> ({contacts.length})
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Quote Requests</span>
            <span className="sm:hidden">Quotes</span> ({quotes.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="contacts" className="space-y-4">
          {contacts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No contact messages yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {contacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-0 sm:justify-between">
                        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{contact.name}</h3>
                            {getStatusBadge(contact.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                            <div className="flex items-center gap-2 text-gray-600 min-w-0">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{contact.email}</span>
                            </div>
                            {contact.phone && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                {contact.phone}
                              </div>
                            )}
                            {contact.company && (
                              <div className="flex items-center gap-2 text-gray-600 truncate">
                                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">{contact.company}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="text-xs sm:text-sm">{formatDate(contact.createdAt)}</span>
                            </div>
                          </div>
                          {contact.service && (
                            <div className="text-xs sm:text-sm text-gray-600">
                              <span className="font-medium">Service:</span> {contact.service}
                            </div>
                          )}
                          <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">{contact.message}</p>
                        </div>
                        <div className="flex gap-2 sm:ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewDetails(contact, 'contact')}
                            className="flex-1 sm:flex-none"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="sm:hidden ml-1">View</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(contact.id, 'contact')}
                            className="flex-1 sm:flex-none"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                            <span className="sm:hidden ml-1">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="quotes" className="space-y-4">
          {quotes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No quote requests yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {quotes.map((quote) => (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-0 sm:justify-between">
                        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{quote.name}</h3>
                            {getStatusBadge(quote.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                            <div className="flex items-center gap-2 text-gray-600 min-w-0">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{quote.email}</span>
                            </div>
                            {quote.phone && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                {quote.phone}
                              </div>
                            )}
                            {quote.company && (
                              <div className="flex items-center gap-2 text-gray-600 truncate">
                                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">{quote.company}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="text-xs sm:text-sm">{formatDate(quote.createdAt)}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                            <div>
                              <span className="font-medium">Equipment:</span> {quote.equipmentType}
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span> {quote.quantity}
                            </div>
                            <div>
                              <span className="font-medium">Budget:</span> {quote.budget}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">{quote.requirements}</p>
                        </div>
                        <div className="flex gap-2 sm:ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewDetails(quote, 'quote')}
                            className="flex-1 sm:flex-none"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="sm:hidden ml-1">View</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(quote.id, 'quote')}
                            className="flex-1 sm:flex-none"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                            <span className="sm:hidden ml-1">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.type === 'contact' ? 'Contact Message Details' : 'Quote Request Details'}
            </DialogTitle>
            <DialogDescription>
              Submitted on {selectedItem && formatDate(selectedItem.createdAt)}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{selectedItem.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedItem.email}</p>
                </div>
                {selectedItem.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedItem.phone}</p>
                  </div>
                )}
                {selectedItem.company && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-gray-900">{selectedItem.company}</p>
                  </div>
                )}
              </div>
              {selectedItem.type === 'quote' && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Equipment Type</label>
                    <p className="text-gray-900">{selectedItem.equipmentType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Quantity</label>
                    <p className="text-gray-900">{selectedItem.quantity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Budget</label>
                    <p className="text-gray-900">{selectedItem.budget}</p>
                  </div>
                  {selectedItem.timeline && (
                    <div className="md:col-span-3">
                      <label className="text-sm font-medium text-gray-500">Timeline</label>
                      <p className="text-gray-900">{selectedItem.timeline}</p>
                    </div>
                  )}
                </div>
              )}
              {selectedItem.service && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Service</label>
                  <p className="text-gray-900">{selectedItem.service}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {selectedItem.type === 'quote' ? 'Requirements' : 'Message'}
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {selectedItem.type === 'quote' ? selectedItem.requirements : selectedItem.message}
                </p>
              </div>
              {selectedItem.type === 'quote' && selectedItem.additionalInfo && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Additional Information</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedItem.additionalInfo}</p>
                </div>
              )}
              <div className="flex items-center gap-4 pt-4 border-t">
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Select
                  value={selectedItem.status}
                  onValueChange={(value) => handleStatusChange(selectedItem.id, value, selectedItem.type)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default FormSubmissions;
