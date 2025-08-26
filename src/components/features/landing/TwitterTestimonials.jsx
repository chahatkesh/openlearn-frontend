import React, { useEffect, useRef, useState } from 'react';
import { extractTweetId, isValidTweetUrl } from '../../../utils/social/twitterService';
import { tweetUrls } from '../../../data/tweetData';
import SectionHeader from '../../common/SectionHeader';

const TwitterEmbed = ({ tweetId }) => {
  const tweetRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    // Load Twitter widgets script if not already loaded
    if (!window.twttr) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.onload = () => {
        if (window.twttr && window.twttr.widgets) {
          window.twttr.widgets.load(tweetRef.current).then(() => {
            setIsLoading(false);
          }).catch(() => {
            setHasError(true);
            setIsLoading(false);
          });
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      };
      script.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      // If Twitter widgets are already loaded, just load this specific tweet
      window.twttr.widgets.load(tweetRef.current).then(() => {
        setIsLoading(false);
      }).catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
    }
  }, [tweetId]);

  if (hasError) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">
          Unable to load tweet
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-600 rounded w-5/6"></div>
            <div className="h-4 bg-gray-600 rounded w-4/6"></div>
          </div>
        </div>
      )}
      <div ref={tweetRef} className="flex justify-center">
        <blockquote className="twitter-tweet" data-theme="dark">
          <a href={`https://twitter.com/twitter/statuses/${tweetId}`}>Loading tweet...</a>
        </blockquote>
      </div>
    </div>
  );
};

const TwitterTestimonials = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  
  // Sort tweets to show featured ones first
  const sortedTweets = [...tweetUrls].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  // Get valid tweet URLs and extract IDs
  const validTweetUrls = sortedTweets
    .map(tweet => tweet.url)
    .filter(isValidTweetUrl);
  
  const tweetIds = validTweetUrls
    .map(extractTweetId)
    .filter(Boolean);

  // Show tweets based on visibleCount
  const displayedTweetIds = tweetIds.slice(0, visibleCount);
  const hasMoreTweets = tweetIds.length > visibleCount;

  // Show placeholder when no tweets are provided
  if (tweetIds.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Pioneers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Join thousands of learners who are already transforming their education with OpenLearn.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto shadow-lg">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Testimonials from our amazing community will appear here soon! 
                <br />
                Be the first to share your OpenLearn success story.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-32 bg-black text-white">
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="What Our Pioneers Say"
          description="Real stories from real learners who found their path with us"
          titleClassName="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight"
          descriptionClassName="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light"
        />

        <div className="relative">
          {/* Masonry Grid Layout */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 max-w-6xl mx-auto space-y-8">
            {displayedTweetIds.map((tweetId) => (
              <div 
                key={tweetId} 
                className="break-inside-avoid mb-8 transform hover:scale-[1.02] transition-all duration-300 ease-out"
              >
                <TwitterEmbed tweetId={tweetId} />
              </div>
            ))}
          </div>

          {/* Button Controls */}
          {(hasMoreTweets || visibleCount > 6) && (
            <div className="text-center mt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {hasMoreTweets && (
                  <button
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="inline-flex items-center px-6 py-3 bg-[#FFDE59] text-black font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#FFDE59]/90"
                  >
                    Read More
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
                
                {visibleCount > 6 && (
                  <button
                    onClick={() => setVisibleCount(6)}
                    className="inline-flex items-center px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-600"
                  >
                    Show Less
                    <svg className="ml-2 w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TwitterTestimonials;
