import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { AppError } from '../middleware/errorHandler';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export const getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const response = await axios.get(`${AI_SERVICE_URL}/api/recommendations/${userId}`, {
      params: { limit },
    });

    res.json({
      success: true,
      recommendations: response.data.recommendations,
    });
  } catch (error: any) {
    if (error.response?.status === 503) {
      return res.status(503).json({
        success: false,
        message: 'Servicio de IA no disponible. El modelo necesita ser entrenado.',
      });
    }
    next(error);
  }
};

export const getSimilarProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;

    const response = await axios.get(`${AI_SERVICE_URL}/api/recommendations/product/${productId}`, {
      params: { limit },
    });

    res.json({
      success: true,
      similarProducts: response.data.similar_products,
    });
  } catch (error: any) {
    if (error.response?.status === 503) {
      return res.status(503).json({
        success: false,
        message: 'Servicio de IA no disponible',
      });
    }
    next(error);
  }
};

export const trainModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/api/recommendations/train`);

    res.json({
      success: true,
      message: response.data.message,
      accuracy: response.data.accuracy_percent,
      targetMet: response.data.target_met,
    });
  } catch (error) {
    next(error);
  }
};

export const getModelAccuracy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/api/recommendations/accuracy`);

    res.json({
      success: true,
      accuracy: response.data.accuracy_percent,
      targetMet: response.data.target_met,
      target: 80,
    });
  } catch (error: any) {
    if (error.response?.status === 503) {
      return res.status(503).json({
        success: false,
        message: 'Modelo no entrenado',
      });
    }
    next(error);
  }
};

