"""
Script para importar productos automáticamente desde una página web.
Soporta Amazon, MercadoLibre y otras páginas de e-commerce.
"""

import requests
from bs4 import BeautifulSoup
import re
import sys
import os

# Agregar el directorio backend al path para importar Prisma
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    from prisma import Prisma
    prisma = Prisma()
except:
    # Si no está disponible Prisma, usar requests directo a la API
    prisma = None

def extract_amazon_products(url, limit=20):
    """Extrae productos de Amazon"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        products = []
        # Buscar contenedores de productos en Amazon
        product_containers = soup.find_all('div', {'data-component-type': 's-search-result'})[:limit]
        
        for container in product_containers:
            try:
                # Nombre
                name_elem = container.find('h2', class_='a-size-mini')
                if not name_elem:
                    name_elem = container.find('span', class_='a-text-normal')
                name = name_elem.get_text(strip=True) if name_elem else 'Producto sin nombre'
                
                # Precio
                price_elem = container.find('span', class_='a-price-whole')
                if price_elem:
                    price_text = price_elem.get_text(strip=True).replace(',', '')
                    price = float(re.sub(r'[^\d.]', '', price_text))
                else:
                    price = 99.99  # Precio por defecto
                
                # Imagen
                img_elem = container.find('img', class_='s-image')
                image_url = img_elem.get('src') if img_elem else None
                
                # Link del producto
                link_elem = container.find('a', class_='a-link-normal')
                product_url = 'https://www.amazon.com' + link_elem.get('href', '') if link_elem else None
                
                # Categoría (intentar extraer de la URL o usar genérica)
                category = 'electronics'  # Por defecto
                
                products.append({
                    'name': name[:200],  # Limitar longitud
                    'description': f'Producto importado desde Amazon. {name}',
                    'price': price,
                    'category': category,
                    'stock': 100,  # Stock por defecto
                    'imageUrl': image_url
                })
            except Exception as e:
                print(f"Error extrayendo producto: {e}")
                continue
        
        return products
    except Exception as e:
        print(f"Error al acceder a Amazon: {e}")
        return []

def extract_generic_products(url, limit=20):
    """Extrae productos de páginas genéricas de e-commerce"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        products = []
        
        # Buscar patrones comunes de productos
        # Buscar elementos con clases comunes de productos
        product_selectors = [
            {'class': 'product'},
            {'class': 'item'},
            {'class': 'product-item'},
            {'data-product': True},
        ]
        
        found_products = []
        for selector in product_selectors:
            found = soup.find_all('div', selector)
            if found:
                found_products = found[:limit]
                break
        
        # Si no encuentra, buscar cualquier elemento con precio
        if not found_products:
            # Buscar elementos que contengan símbolos de precio
            price_elements = soup.find_all(string=re.compile(r'\$|€|£'))
            for price_elem in price_elements[:limit]:
                parent = price_elem.find_parent()
                if parent:
                    found_products.append(parent)
        
        for container in found_products[:limit]:
            try:
                # Intentar extraer nombre
                name_elem = container.find(['h1', 'h2', 'h3', 'h4', 'span', 'a'], class_=re.compile(r'title|name|product'))
                if not name_elem:
                    name_elem = container.find(['h1', 'h2', 'h3'])
                name = name_elem.get_text(strip=True) if name_elem else 'Producto importado'
                
                # Intentar extraer precio
                price_text = container.find(string=re.compile(r'\$[\d,]+\.?\d*'))
                if price_text:
                    price = float(re.sub(r'[^\d.]', '', price_text))
                else:
                    price = 99.99
                
                # Intentar extraer imagen
                img_elem = container.find('img')
                image_url = img_elem.get('src') if img_elem else None
                if image_url and not image_url.startswith('http'):
                    # URL relativa, convertir a absoluta
                    from urllib.parse import urljoin
                    image_url = urljoin(url, image_url)
                
                products.append({
                    'name': name[:200],
                    'description': f'Producto importado desde {url}',
                    'price': price,
                    'category': 'electronics',  # Categoría por defecto
                    'stock': 100,
                    'imageUrl': image_url
                })
            except Exception as e:
                continue
        
        return products
    except Exception as e:
        print(f"Error al acceder a la página: {e}")
        return []

def import_to_database(products, api_url='http://localhost:3001/api'):
    """Importa productos a la base de datos vía API"""
    import requests
    
    # Necesitas estar autenticado como admin
    print("\n⚠️  IMPORTANTE: Necesitas un token de admin para importar productos")
    print("1. Inicia sesión como admin en http://localhost:3000")
    print("2. Abre la consola del navegador (F12)")
    print("3. Ejecuta: localStorage.getItem('token')")
    print("4. Copia el token y pégalo aquí\n")
    
    token = input("Token de admin (o presiona Enter para usar API directamente): ").strip()
    
    if not token:
        print("❌ Se necesita token de admin para importar productos")
        return
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    imported = 0
    failed = 0
    
    for product in products:
        try:
            response = requests.post(
                f'{api_url}/products',
                json=product,
                headers=headers
            )
            if response.status_code == 201:
                imported += 1
                print(f"✅ Importado: {product['name'][:50]}")
            else:
                failed += 1
                print(f"❌ Error: {product['name'][:50]} - {response.status_code}")
        except Exception as e:
            failed += 1
            print(f"❌ Error: {product['name'][:50]} - {str(e)}")
    
    print(f"\n📊 Resumen: {imported} importados, {failed} fallidos")

def main():
    print("🛒 Importador de Productos desde Web")
    print("=" * 50)
    
    url = input("\nIngresa la URL de la página de productos: ").strip()
    if not url:
        print("❌ URL requerida")
        return
    
    limit = input("¿Cuántos productos importar? (default: 20): ").strip()
    limit = int(limit) if limit.isdigit() else 20
    
    print(f"\n🔍 Analizando {url}...")
    
    # Detectar tipo de página
    if 'amazon' in url.lower():
        print("📦 Detectado: Amazon")
        products = extract_amazon_products(url, limit)
    else:
        print("🌐 Página genérica detectada")
        products = extract_generic_products(url, limit)
    
    if not products:
        print("❌ No se pudieron extraer productos. Intenta con otra URL.")
        return
    
    print(f"\n✅ Se encontraron {len(products)} productos")
    print("\nPrimeros productos encontrados:")
    for i, p in enumerate(products[:5], 1):
        print(f"{i}. {p['name'][:60]} - ${p['price']}")
    
    confirm = input(f"\n¿Importar {len(products)} productos? (s/n): ").strip().lower()
    if confirm != 's':
        print("❌ Cancelado")
        return
    
    import_to_database(products)

if __name__ == '__main__':
    main()

