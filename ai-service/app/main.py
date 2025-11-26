from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from app.services.recommendation_service import RecommendationService

load_dotenv()

app = FastAPI(
    title="Ventas Inteligentes - AI Service",
    description="Servicio de recomendaciones inteligentes con IA",
    version="1.0.0"
)

# Inicializar servicio de recomendaciones
recommendation_service = RecommendationService()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return JSONResponse({
        "status": "ok",
        "service": "ai-service",
        "version": "1.0.0"
    })

@app.get("/api/recommendations/{user_id}")
async def get_recommendations(user_id: str, limit: int = 10):
    """
    Obtiene recomendaciones de productos para un usuario.
    Usa Content-Based y Collaborative Filtering para alcanzar 80%+ de precisión.
    """
    try:
        if not recommendation_service.is_trained:
            return JSONResponse({
                "success": False,
                "message": "Modelo no entrenado. Ejecuta /api/recommendations/train primero"
            }, status_code=503)
        
        recommendations = recommendation_service.get_recommendations(user_id, limit)
        
        return JSONResponse({
            "success": True,
            "user_id": user_id,
            "recommendations": recommendations,
            "count": len(recommendations)
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar recomendaciones: {str(e)}")

@app.get("/api/recommendations/product/{product_id}")
async def get_similar_products(product_id: str, limit: int = 5):
    """
    Obtiene productos similares a uno dado usando Content-Based Filtering.
    """
    try:
        if not recommendation_service.is_trained:
            return JSONResponse({
                "success": False,
                "message": "Modelo no entrenado"
            }, status_code=503)
        
        similar = recommendation_service.get_similar_products(product_id, limit)
        
        return JSONResponse({
            "success": True,
            "product_id": product_id,
            "similar_products": similar,
            "count": len(similar)
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener productos similares: {str(e)}")

@app.post("/api/recommendations/train")
async def train_model():
    """
    Entrena el modelo de recomendaciones.
    Combina Content-Based y Collaborative Filtering.
    """
    try:
        recommendation_service.train()
        
        # Evaluar precisión
        accuracy = recommendation_service.evaluate_accuracy()
        accuracy_percent = accuracy * 100
        
        return JSONResponse({
            "success": True,
            "message": "Modelo entrenado exitosamente",
            "accuracy": accuracy,
            "accuracy_percent": round(accuracy_percent, 2),
            "target_met": accuracy >= 0.80
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al entrenar modelo: {str(e)}")

@app.get("/api/recommendations/accuracy")
async def get_accuracy():
    """
    Obtiene la precisión actual del modelo.
    """
    try:
        if not recommendation_service.is_trained:
            return JSONResponse({
                "success": False,
                "message": "Modelo no entrenado"
            }, status_code=503)
        
        accuracy = recommendation_service.evaluate_accuracy()
        accuracy_percent = accuracy * 100
        
        return JSONResponse({
            "success": True,
            "accuracy": accuracy,
            "accuracy_percent": round(accuracy_percent, 2),
            "target_met": accuracy >= 0.80,
            "target": 0.80
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al evaluar precisión: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

