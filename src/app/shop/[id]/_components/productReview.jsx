import React, { useState, useEffect, useContext } from 'react';
import { Star, Send } from 'lucide-react';
import { Rating } from 'react-simple-star-rating'; 
import { getProductReviews, addReview } from '../../../../lib/api';
import toast from 'react-hot-toast';
import AuthContext from '../../../../context/AuthContext';

export default function ProductReviews({ productId, avgRating, totalReviews }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchReviews = async () => {
    try {
      const data = await getProductReviews(productId);
      setReviews(data);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      console.error("Failed to fetch reviews");
    }
  };



  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select stars!");
    if (!comment.trim()) return toast.error("Please write a comment!");

    setSubmitting(true);
    try {
      const reviewData = {
        productID: productId,
        rating: rating, 
        comment: comment,
        userID: user?._id 
      };

      const res = await addReview(reviewData);
      if (res.success) {
        toast.success("Review added successfully!");
        setComment('');
        setRating(0);
        setShowForm(false);
        fetchReviews();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F5E6D3] py-20 mt-20">
      <div className="site-container grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* বাম পাশ: সামারি এবং ফর্ম */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-[32px] font-bold text-black leading-tight">Ratings and Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex text-black">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={i < Math.round(avgRating || 0) ? "fill-current" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-[16px] font-medium text-gray-700">{totalReviews || 0} Reviews</span>
          </div>
          
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-[#FF4E8E] px-8 py-3 rounded-full font-bold text-[14px] shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            {showForm ? "Close Form" : "Write a Review"}
          </button>

          {/* Form Section */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showForm ? 'max-h-[600px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
            <div className="bg-[#EFE1D1] p-6 rounded-2xl border border-black/5">
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                
                <div className="space-y-2">
                  <p className="text-[12px] font-bold uppercase text-gray-400 tracking-widest">Your Rating</p>
                  
                  {/* ডকুমেন্টেশন অনুযায়ী প্রপস সেট করা হয়েছে */}
                  <div className="flex items-center gap-4">
                    <Rating
                      onClick={(rate) => setRating(rate)}
                      initialValue={rating}
                      size={32}
                      transition={true}
                      fillColor="black"
                      emptyColor="#D1D5DB"
                      allowFraction={false}
                      /* inline-flex নিশ্চিত করবে স্টারগুলো পাশাপাশি থাকবে */
                      className="react-simple-star-rating"
                      style={{ display: 'flex', flexDirection: 'row' }}
                      SVGstyle={{ display: 'inline' }}
                    />
                    {rating > 0 && (
                      <span className="text-xl font-bold text-black border-l-2 border-black/10 pl-4">
                        {rating}.0
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[12px] font-bold uppercase text-gray-400 tracking-widest">Your Comment</p>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full h-32 p-4 bg-white rounded-xl outline-none focus:ring-1 focus:ring-black transition-all resize-none text-sm"
                    placeholder="Share your experience..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black text-white h-[56px] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : <>Submit <Send size={18} /></>}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ডান পাশ: রিভিউ লিস্ট */}
        <div className="lg:col-span-8 space-y-10">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="flex gap-6 border-b border-black/10 pb-10 last:border-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-white">
                  <img src={review.userID?.profileImage || "https://i.pravatar.cc/150"} alt="user" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-3">
                  <div className="flex text-black gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-300"} />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed text-[15px]">{review.comment}</p>
                  <div>
                    <h4 className="font-bold text-black text-[14px]">{review.userID?.name || "Guest User"}</h4>
                    <p className="text-gray-500 text-[12px]">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No reviews yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </div>
    </div>
  );
}