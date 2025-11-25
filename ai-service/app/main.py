from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Ventas Inteligentes - AI Service",
    description="Servicio de recomendaciones inteligentes con IA",
    version="1.0.0"
)

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
    
    TODO: Implementar modelo de ML real
    """
    # Placeholder - implementar con modelo real
    recommendations = [
        {"product_id": f"prod_{i}", "score": 0.9 - (i * 0.1)}
        for i in range(limit)
    ]
    
    return JSONResponse({
        "success": True,
        "user_id": user_id,
        "recommendations": recommendations,
        "message": "Recomendaciones generadas (modelo pendiente de entrenamiento)"
    })

@app.get("/api/recommendations/product/{product_id}")
async def get_similar_products(product_id: str, limit: int = 5):
    """
    Obtiene productos similares a uno dado.
    """
    # Placeholder
    similar = [
        {"product_id": f"prod_{i}", "similarity": 0.9 - (i * 0.1)}
        for i in range(limit)
    ]
    
    return JSONResponse({
        "success": True,
        "product_id": product_id,
        "similar_products": similar
    })

@app.post("/api/recommendations/train")
async def train_model():
    """
    Entrena el modelo de recomendaciones.
    TODO: Implementar entrenamiento real
    """
    return JSONResponse({
        "success": True,
        "message": "Modelo entrenado (pendiente implementación)"
    })

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

