import React, { useState, useEffect } from 'react';
import { firebaseService } from '@/lib/firebaseService';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Package, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const FeedbackList = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const response = await firebaseService.getAllFeedback();
      if (response.success) {
        const feedbackData = response.data || [];
        setFeedback(feedbackData);
        calculateStats(feedbackData);
      }
    } catch (error) {
      console.error('Failed to load feedback:', error);
      toast({
        title: "Error",
        description: "Failed to load feedback.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (feedbackData) => {
    if (feedbackData.length === 0) {
      setStats({ average: 0, total: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
      return;
    }

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;

    feedbackData.forEach(item => {
      if (item.rating) {
        distribution[item.rating]++;
        total += item.rating;
      }
    });

    setStats({
      average: (total / feedbackData.length).toFixed(1),
      total: feedbackData.length,
      distribution
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Customer Feedback & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-center py-8">Loading feedback...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Average Rating</span>
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-3xl font-bold text-yellow-700">{stats.average}</p>
                    <div className="text-sm text-gray-600">/ 5.0</div>
                  </div>
                  <div className="mt-2">
                    {renderStars(Math.round(stats.average))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Total Reviews</span>
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
                  <p className="text-sm text-gray-600 mt-2">Customer feedback received</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Rating Distribution</span>
                    <Star className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600 w-8">{rating} ★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${stats.total > 0 ? (stats.distribution[rating] / stats.total) * 100 : 0}%`
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-8">{stats.distribution[rating]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {feedback.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No feedback received yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedback.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                          <div className="w-10 h-10 rounded-full bg-bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.customer_name || 'Anonymous'}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Package className="w-3 h-3" />
                              <span>Order #{item.order_id?.substring(0, 8) || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end space-y-1">
                          {renderStars(item.rating)}
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(item.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      {item.feedback && (
                        <div className="bg-gray-50 rounded-lg p-3 mt-3">
                          <p className="text-sm text-gray-700 italic">"{item.feedback}"</p>
                        </div>
                      )}

                      {item.order_total && (
                        <div className="mt-3 text-sm text-gray-600">
                          <span>Order Value: </span>
                          <span className="font-medium">₹{parseFloat(item.order_total).toFixed(2)}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackList;
