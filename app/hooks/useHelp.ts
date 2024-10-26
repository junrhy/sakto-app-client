import { useState, useMemo, useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const API_URL = '/api/help'; // Replace with your actual API endpoint

export function useHelp() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`${API_URL}/faqs`);
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      const data = await response.json();
      setFaqItems(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const filteredFAQs = useMemo(() => {
    return faqItems.filter(item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [faqItems, searchTerm]);

  return {
    faqItems,
    filteredFAQs,
    searchTerm,
    setSearchTerm,
    fetchFAQs,
  };
}
