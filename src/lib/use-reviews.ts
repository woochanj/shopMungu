"use client";

import { useEffect, useState } from "react";
import {
  QNA_EVENT,
  REVIEW_EVENT,
  type Question,
  type Review,
  qnaRepo,
  reviewRepo,
} from "./review-repository";

export function useReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const load = () => setReviews(reviewRepo.byProduct(productId));
    load();
    window.addEventListener(REVIEW_EVENT, load);
    return () => window.removeEventListener(REVIEW_EVENT, load);
  }, [productId]);

  return reviews;
}

export function useQuestions(productId: string) {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const load = () => setQuestions(qnaRepo.byProduct(productId));
    load();
    window.addEventListener(QNA_EVENT, load);
    return () => window.removeEventListener(QNA_EVENT, load);
  }, [productId]);

  return questions;
}
