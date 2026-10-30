import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, uploadProductImage } from "../services/productService";
import Navbar from "../components/Navbar";

import "../styles/products.css";

const CATEGORIAS = [
  {
    id: "lacteos",
    nombre: "Lácteos y Huevos",
    icono: "🧀",
    subtipos: [
      "Leche entera", "Leche semidesnatada", "Leche desnatada", "Huevos", "Huevos camperos", "Yogur natural", "Yogur griego", "Yogur de sabores", "Leche sin lactosa", "Queso fresco", "Queso semicurado", "Queso curado", "Queso rallado", "Queso de untar", "Mantequilla", "Bebida de avena", "Bebida de soja", "Nata para cocinar", "Queso mozzarella", "Queso parmesano", "Queso cheddar", "Kéfir", "Flan", "Natillas", "Queso de Burgos", "Queso azul", "Queso brie", "Queso provolone", "Queso de cabra", "Queso cottage", "Ricotta", "Mascarpone", "Requesón", "Queso de oveja", "Queso de mezcla", "Queso en lonchas", "Queso para gratinar", "Queso para pizza", "Leche fresca", "Leche condensada", "Leche evaporada", "Leche en polvo", "Bebida de almendra", "Bebida de arroz", "Bebida de coco", "Nata para montar", "Nata vegetal", "Yogur azucarado", "Yogur desnatado", "Yogur de frutas", "Yogur líquido", "Yogur de proteínas", "Yogur sin lactosa", "Yogur vegetal", "Arroz con leche", "Cuajada", "Mousse de chocolate", "Mousse de limón", "Copa de chocolate y nata", "Petit suisse", "Tiramisú refrigerado", "Crema catalana", "Queso fresco batido", "Margarina", "Huevos ecológicos", "Huevos de codorniz", "Huevos cocidos", "Claras de huevo pasteurizadas"
    ],
  },
  {
    id: "pan",
    nombre: "Pan",
    icono: "🥖",
    subtipos: [
      "Barra de pan", "Pan de molde blanco", "Pan de molde integral", "Baguette", "Pan integral", "Pan de pueblo", "Pan de hogaza", "Pan de masa madre", "Pan rallado", "Panecillos de hamburguesa", "Panecillos de perrito caliente", "Picos de pan", "Biscotes", "Pan tostado", "Tortillas de trigo", "Tortillas de maíz", "Bases de pizza", "Pan rústico", "Pan de centeno", "Pan de semillas", "Pan multicereales", "Pan de chapata", "Pan de cristal", "Pan de payés", "Pan de molde sin corteza", "Pan de molde con semillas", "Pan de molde sin gluten", "Pan de molde brioche", "Panecillos", "Panecillos integrales", "Panecillos de cereales", "Panecillos de leche", "Molletes", "Pan de bocadillo", "Tostadas integrales", "Colines", "Regañás", "Pan sueco", "Pan de pita", "Pan naan", "Bagels", "Pan de ajo", "Tortillas para fajitas", "Tortillas para tacos"
    ],
  },
  {
    id: "bolleria",
    nombre: "Bollería",
    icono: "🥐",
    subtipos: [
      "Magdalenas", "Croissant", "Donuts", "Napolitana de chocolate", "Palmeras", "Sobaos pasiegos", "Bizcocho", "Gofres", "Tortitas", "Muffins", "Brioches", "Ensaimadas", "Churros", "Torrijas", "Roscón de Reyes", "Mini croissant", "Croissant de chocolate", "Napolitana de crema", "Palmeritas de chocolate", "Cañas de chocolate", "Cañas de crema", "Hojaldres", "Magdalenas integrales", "Magdalenas de chocolate", "Donuts de chocolate", "Donuts glaseados", "Donuts rellenos", "Bollos de leche", "Bollos de chocolate", "Suizos", "Berlinas", "Pepitos de crema", "Bambas de nata", "Muffins de chocolate", "Muffins de arándanos", "Bizcocho de chocolate", "Bizcocho de limón", "Brownie", "Brazo de gitano", "Tarta de manzana", "Tarta de queso", "Tarta de chocolate", "Tarta de nata", "Pastel de crema", "Milhojas", "Crepes dulces", "Porras", "Rosquillas", "Bollos rellenos de cacao", "Pastelitos rellenos", "Pan de leche envasado", "Mini napolitanas"
    ],
  },
  {
    id: "carne",
    nombre: "Carne",
    icono: "🥩",
    subtipos: [
      "Pechuga de pollo", "Filetes de pollo", "Carne picada de ternera", "Carne picada de cerdo", "Lomo de cerdo", "Chuletas de cerdo", "Filetes de ternera", "Hamburguesas de ternera", "Pechuga de pavo", "Costillas de cerdo", "Alitas de pollo", "Muslos de pollo", "Entrecot", "Solomillo de cerdo", "Pinchos morunos", "Lomo adobado", "Filetes empanados", "San Jacobos", "Albóndigas", "Pollo entero", "Contramuslos de pollo", "Jamoncitos de pollo", "Solomillo de pollo", "Pollo troceado", "Carne picada de pollo", "Filetes de pavo", "Solomillo de pavo", "Muslos de pavo", "Carne picada de pavo", "Hamburguesas de pavo", "Chuletón", "Solomillo de ternera", "Chuletas de ternera", "Carne para guisar", "Carne para estofar", "Morcillo", "Redondo de ternera", "Costillas de ternera", "Carrilleras de ternera", "Escalopines de ternera", "Panceta", "Magro de cerdo", "Secreto ibérico", "Presa ibérica", "Pluma ibérica", "Carrilleras de cerdo", "Codillo", "Costillas adobadas", "Chuletas de cordero", "Pierna de cordero", "Paletilla de cordero", "Costillar de cordero", "Cordero troceado", "Conejo", "Codorniz", "Pato", "Carne picada mixta", "Hamburguesas mixtas", "Brochetas de pollo", "Brochetas de carne", "Carne para fajitas", "Carne para kebab", "Cachopo", "Flamenquines", "Hígado", "Callos", "Manitas de cerdo", "Rabo de ternera", "Mollejas"
    ],
  },
  {
    id: "pescado",
    nombre: "Pescado y Marisco",
    icono: "🐟",
    subtipos: [
      "Merluza", "Salmón", "Atún", "Atún en lata", "Gambas", "Langostinos", "Bacalao", "Sardinas", "Calamares", "Mejillones", "Gulas", "Salmón ahumado", "Pulpo cocido", "Pescadilla", "Rape", "Lenguado", "Gallo", "Lubina", "Dorada", "Rodaballo", "Abadejo", "Bonito del norte", "Boquerones", "Anchoas frescas", "Caballa", "Jurel", "Trucha", "Pez espada", "Salmonetes", "Filetes de merluza", "Lomos de salmón", "Filetes de bacalao", "Ventresca de atún", "Pescado para sopa", "Pescado para horno", "Pescado marinado", "Sushi", "Sashimi", "Tartar de salmón", "Gambones", "Cigalas", "Bogavante", "Langosta", "Buey de mar", "Centollo", "Nécoras", "Percebes", "Camarones", "Cangrejo", "Surimi", "Palitos de cangrejo", "Almejas", "Berberechos", "Navajas", "Ostras", "Vieiras", "Sepia", "Chipirones", "Pulpo", "Pota", "Chirlas", "Langostinos cocidos", "Preparado para paella", "Preparado para fideuá", "Preparado para sopa de pescado", "Calamares a la romana", "Rabas", "Anillas de calamar", "Bacalao desalado", "Anchoas en salazón", "Mojama", "Trucha ahumada"
    ],
  },
  {
    id: "verduras",
    nombre: "Verduras y Hortalizas",
    icono: "🥦",
    subtipos: [
      "Tomate", "Patata", "Cebolla", "Lechuga", "Zanahoria", "Pimiento verde", "Pimiento rojo", "Calabacín", "Ajo", "Pepino", "Berenjena", "Brócoli", "Espinacas", "Judías verdes", "Guisantes", "Champiñones", "Puerro", "Cogollos", "Lechuga iceberg", "Tomate cherry", "Cebolla morada", "Cebolleta", "Boniato", "Acelgas", "Canónigos", "Rúcula", "Escarola", "Coliflor", "Repollo", "Col lombarda", "Coles de Bruselas", "Calabaza", "Pimiento amarillo", "Pimiento de Padrón", "Habas", "Alcachofas", "Espárragos verdes", "Espárragos blancos", "Apio", "Nabo", "Rábanos", "Remolacha", "Maíz", "Setas", "Brotes de soja", "Jengibre", "Perejil", "Cilantro", "Albahaca", "Hierbabuena", "Romero", "Tomillo", "Eneldo", "Ensalada en bolsa", "Mezcla de lechugas", "Verduras para sopa", "Verduras para wok", "Menestra de verduras", "Gazpacho", "Salmorejo"
    ],
  },
  {
    id: "frutas",
    nombre: "Frutas",
    icono: "🍎",
    subtipos: [
      "Plátano", "Manzana", "Naranja", "Mandarina", "Pera", "Limón", "Sandía", "Melón", "Kiwi", "Fresas", "Aguacate", "Melocotón", "Uvas", "Piña", "Mango", "Nectarina", "Ciruela", "Cereza", "Lima", "Pomelo", "Paraguayo", "Albaricoque", "Frambuesas", "Arándanos", "Moras", "Papaya", "Coco", "Plátano macho", "Granada", "Caqui", "Chirimoya", "Nísperos", "Membrillo", "Higos", "Brevas", "Dátiles", "Maracuyá", "Fruta de la pasión", "Fruta del dragón", "Lichis", "Guayaba", "Kumquat", "Fruta cortada", "Macedonia de frutas", "Ensalada de frutas", "Coco rallado", "Castañas"
    ],
  },
  {
    id: "congelados",
    nombre: "Congelados y Hielo",
    icono: "🧊",
    subtipos: [
      "Cubitos de hielo", "Patatas fritas congeladas", "Pizzas congeladas", "Croquetas congeladas", "Nuggets de pollo", "Guisantes congelados", "Espinacas congeladas", "Lasaña congelada", "Helados", "Merluza congelada", "Gambas congeladas", "Empanadillas congeladas", "Hielo picado", "Judías verdes congeladas", "Acelgas congeladas", "Brócoli congelado", "Coliflor congelada", "Zanahorias congeladas", "Menestra congelada", "Alcachofas congeladas", "Habas congeladas", "Maíz congelado", "Champiñones congelados", "Setas congeladas", "Verduras para wok congeladas", "Verduras para sopa congeladas", "Pisto congelado", "Cebolla troceada congelada", "Pimiento troceado congelado", "Patatas gajo congeladas", "Patatas rústicas congeladas", "Patatas deluxe congeladas", "Patatas bravas congeladas", "Patatas para horno congeladas", "Aros de cebolla congelados", "Boniato frito congelado", "Bacalao congelado", "Salmón congelado", "Lenguado congelado", "Filetes de pescado empanados", "Palitos de pescado", "Langostinos congelados", "Gambones congelados", "Calamares congelados", "Sepia congelada", "Pulpo congelado", "Mejillones congelados", "Preparado para paella congelado", "Pechugas de pollo congeladas", "Alitas de pollo congeladas", "Carne picada congelada", "Hamburguesas congeladas", "Albóndigas congeladas", "Fingers de pollo", "Pollo empanado", "San Jacobos congelados", "Flamenquines congelados", "Cachopos congelados", "Kebab congelado", "Canelones congelados", "Empanadas congeladas", "Aros de cebolla", "Rollitos de primavera", "Gyozas", "Tequeños", "Falafel congelado", "Burritos congelados", "Arroz tres delicias congelado", "Paella congelada", "Tortilla de patata congelada", "Masa de pizza congelada", "Hojaldre congelado", "Churros congelados", "Gofres congelados", "Crepes congelados", "Polos de hielo", "Conos de helado", "Tarrinas de helado", "Sándwiches helados", "Bombones helados", "Tartas heladas", "Sorbetes", "Granizados"
    ],
  },
  {
    id: "higiene",
    nombre: "Higiene y Cuidado Personal",
    icono: "🪥",
    subtipos: [
      "Papel higiénico", "Gel de ducha", "Champú", "Pasta de dientes", "Desodorante", "Toallitas húmedas", "Compresas", "Cepillo de dientes", "Maquinillas de afeitar", "Espuma de afeitar", "Jabón de manos", "Colutorio", "Acondicionador", "Crema hidratante facial", "Protector solar corporal", "Pañales de bebé", "Toallitas para bebé", "Tiritas", "Cepillo de dientes eléctrico", "Recambios para cepillo eléctrico", "Hilo dental", "Cepillos interdentales", "Limpiador lingual", "Champú anticaspa", "Champú para cabello graso", "Champú para cabello seco", "Champú para cabello teñido", "Champú en seco", "Mascarilla capilar", "Sérum capilar", "Aceite capilar", "Espuma para el pelo", "Gel fijador", "Cera para el pelo", "Laca", "Tinte para el pelo", "Decolorante", "Desenredante", "Cepillo para el pelo", "Peine", "Gomas para el pelo", "Horquillas", "Pinzas para el pelo", "Jabón en pastilla", "Jabón íntimo", "Esponja de baño", "Exfoliante corporal", "Crema corporal", "Loción hidratante", "Aceite corporal", "Antitranspirante", "Desodorante en spray", "Desodorante en roll-on", "Perfume", "Colonia", "Agua de colonia", "Limpiador facial", "Agua micelar", "Tónico facial", "Sérum facial", "Contorno de ojos", "Crema antiarrugas", "Exfoliante facial", "Mascarilla facial", "Toallitas desmaquillantes", "Desmaquillante", "Protector solar facial", "After sun", "Bálsamo labial", "Vaselina", "Cuchillas de afeitar", "Gel de afeitar", "Aftershave", "Recortadora de barba", "Aceite para barba", "Crema depilatoria", "Bandas de cera depilatoria", "Cera depilatoria", "Depiladora eléctrica", "Pinzas de depilar", "Compresas nocturnas", "Salvaslips", "Tampones", "Copa menstrual", "Bragas menstruales", "Toallitas íntimas", "Pañales-braga", "Pañales de recién nacido", "Crema para pañal", "Champú infantil", "Gel infantil", "Colonia infantil", "Bastoncillos de algodón", "Algodón en discos", "Algodón en rollo", "Pañuelos de papel", "Pañuelos de bolsillo", "Gasas", "Esparadrapo", "Apósitos", "Mascarillas", "Guantes desechables", "Cortaúñas", "Lima de uñas", "Tijeras de uñas", "Quitaesmalte", "Esmalte de uñas", "Crema de manos", "Crema de pies", "Maquillaje", "Base de maquillaje", "Corrector", "Polvos de maquillaje", "Máscara de pestañas", "Delineador de ojos", "Sombras de ojos", "Pintalabios", "Brillo labial", "Colorete", "Brochas de maquillaje", "Esponjas de maquillaje", "Repelente de mosquitos", "Preservativos", "Lubricante íntimo"
    ],
  },
  {
    id: "conservas",
    nombre: "Conservas y Enlatados",
    icono: "🥫",
    subtipos: [
      "Tomate frito", "Atún al natural", "Atún en aceite de oliva", "Maíz dulce en conserva", "Garbanzos cocidos", "Lentejas cocidas", "Alubias blancas cocidas", "Aceitunas verdes", "Espárragos blancos en conserva", "Mejillones en escabeche", "Tomate triturado", "Atún en aceite de girasol", "Bonito del norte", "Ventresca de atún", "Sardinas en aceite", "Sardinas en tomate", "Caballa en aceite", "Caballa en escabeche", "Melva en aceite", "Anchoas en aceite", "Boquerones en vinagre", "Mejillones al natural", "Berberechos en conserva", "Almejas en conserva", "Navajas en conserva", "Zamburiñas en conserva", "Pulpo en conserva", "Calamares en su tinta", "Calamares en salsa americana", "Chipirones en su tinta", "Tomate entero en conserva", "Tomate concentrado", "Tomate en dados", "Pisto en conserva", "Alcachofas en conserva", "Champiñones en conserva", "Setas en conserva", "Pimientos del piquillo", "Pimientos asados", "Pimientos morrones", "Guisantes en conserva", "Judías verdes en conserva", "Zanahorias en conserva", "Remolacha en conserva", "Brotes de soja en conserva", "Palmitos en conserva", "Pepinillos en vinagre", "Cebollitas en vinagre", "Alcaparras", "Aceitunas negras", "Aceitunas rellenas", "Encurtidos variados", "Alubias rojas cocidas", "Alubias pintas cocidas", "Alubias negras cocidas", "Judiones cocidos", "Fabes cocidas", "Soja cocida", "Paté de cerdo", "Paté de hígado", "Foie gras", "Magro de cerdo en conserva", "Salchichas en conserva", "Albóndigas en salsa", "Callos en conserva", "Fabada en conserva", "Cocido en conserva", "Lentejas estofadas", "Garbanzos con espinacas", "Alubias con chorizo", "Raviolis en conserva", "Espaguetis en conserva", "Sopa de verduras", "Sopa de pollo", "Caldo de pollo", "Caldo de verduras", "Caldo de pescado", "Caldo de carne", "Crema de calabaza", "Crema de champiñones", "Crema de verduras", "Menestra preparada", "Pimientos rellenos", "Chili con carne", "Curry preparado", "Melocotón en almíbar", "Piña en almíbar", "Pera en almíbar", "Macedonia en almíbar", "Cóctel de frutas", "Mandarinas en almíbar", "Cerezas en almíbar", "Compota de manzana", "Puré de manzana", "Dulce de membrillo", "Castañas en almíbar", "Leche de coco en lata", "Crema de coco", "Paté vegetal", "Hummus envasado"
    ],
  },
  {
    id: "snacks",
    nombre: "Snacks y Frutos Secos",
    icono: "🍿",
    subtipos: [
      "Patatas fritas", "Patatas sabor jamón", "Pipas", "Palomitas saladas", "Frutos secos sin sal", "Almendras", "Nueces", "Pistachos", "Anacardos", "Cacahuetes", "Nachos", "Patatas onduladas", "Patatas campesinas", "Patatas sabor queso", "Patatas sabor barbacoa", "Patatas picantes", "Patatas sabor vinagre", "Patatas artesanas", "Patatas con aceite de oliva", "Patatas sin sal", "Gusanitos", "Ganchitos", "Cortezas de cerdo", "Torreznos", "Conos de maíz", "Pajitas de patata", "Palomitas dulces", "Palomitas con mantequilla", "Palomitas para microondas", "Doritos", "Tortitas de maíz", "Tortitas de arroz", "Tortitas de avena", "Crackers salados", "Colines", "Picos de pan", "Regañás", "Rosquilletas", "Pretzels salados", "Palitos salados", "Grissini", "Galletas saladas", "Aperitivos de arroz", "Aperitivos de lentejas", "Aperitivos de garbanzos", "Chips de verduras", "Chips de plátano", "Chips de yuca", "Aros de cebolla", "Maíz frito", "Maíz tostado", "Garbanzos tostados", "Habas fritas", "Almendras crudas", "Almendras tostadas", "Almendras fritas", "Almendras saladas", "Nueces pecanas", "Nueces de macadamia", "Nueces de Brasil", "Avellanas", "Cacahuetes tostados", "Cacahuetes fritos", "Cacahuetes con miel", "Piñones", "Castañas asadas", "Mezcla de frutos secos", "Cóctel de frutos secos", "Frutos secos caramelizados", "Pasas", "Orejones de albaricoque", "Higos secos", "Dátiles secos", "Ciruelas pasas", "Mango deshidratado", "Piña deshidratada", "Plátano deshidratado", "Manzana deshidratada", "Coco deshidratado", "Arándanos deshidratados", "Barritas de cereales", "Barritas energéticas", "Barritas de proteínas", "Barritas de fruta", "Barritas de frutos secos", "Hummus", "Guacamole", "Salsa de yogur", "Salsa de queso", "Paté de aceitunas", "Crema de queso para untar", "Nachos con queso", "Ensaladilla rusa", "Ensaladilla de cangrejo"
    ],
  },
  {
    id: "despensa",
    nombre: "Despensa y Repostería",
    icono: "🌾",
    subtipos: [
      "Aceite de oliva", "Arroz redondo", "Macarrones", "Espaguetis", "Azúcar blanco", "Harina de trigo", "Lentejas", "Garbanzos", "Pan rallado", "Café", "Pasta", "Arroz basmati", "Penne", "Fusilli", "Alubias", "Aceite de girasol", "Azúcar moreno", "Cacao en polvo", "Sal", "Arroz largo", "Arroz integral", "Arroz vaporizado", "Arroz bomba", "Arroz para sushi", "Arroz salvaje", "Arroz para risotto", "Vasitos de arroz", "Farfalle", "Tallarines", "Fideos finos", "Fideos gruesos", "Fideos para fideuá", "Fideos para sopa", "Cabello de ángel", "Tiburones", "Letras para sopa", "Estrellitas para sopa", "Hélices", "Coditos", "Lazos", "Pasta integral", "Pasta sin gluten", "Pasta de lentejas", "Pasta de garbanzos", "Lasaña", "Canelones", "Raviolis", "Tortellini", "Ñoquis", "Placas de lasaña", "Placas de canelones", "Garbanzos secos", "Lentejas secas", "Alubias blancas secas", "Alubias rojas secas", "Alubias pintas secas", "Alubias negras secas", "Judiones secos", "Fabes secas", "Soja seca", "Guisantes secos", "Harina de fuerza", "Harina integral", "Harina de repostería", "Harina de maíz", "Harina de arroz", "Harina de avena", "Harina de almendra", "Harina de coco", "Harina de garbanzo", "Harina sin gluten", "Maicena", "Sémola de trigo", "Panko", "Levadura fresca", "Levadura seca", "Levadura química", "Bicarbonato", "Azúcar glas", "Azúcar vainillado", "Edulcorante", "Miel", "Sirope de arce", "Sirope de agave", "Melaza", "Cacao puro", "Chocolate para fundir", "Pepitas de chocolate", "Chocolate blanco para repostería", "Fideos de chocolate", "Virutas de chocolate", "Coco rallado", "Gelatina en polvo", "Láminas de gelatina", "Cuajada en polvo", "Flan en polvo", "Preparado para natillas", "Preparado para bizcocho", "Preparado para brownie", "Preparado para tortitas", "Preparado para crepes", "Preparado para magdalenas", "Preparado para pizza", "Preparado para pan", "Esencia de vainilla", "Aroma de limón", "Aroma de naranja", "Canela en polvo", "Canela en rama", "Vainilla", "Nueces para repostería", "Almendras laminadas", "Almendras molidas", "Avellanas molidas", "Pasas para repostería", "Fruta escarchada", "Cerezas confitadas", "Nata en spray", "Fondant", "Colorantes alimentarios", "Decoraciones de azúcar", "Sprinkles", "Moldes de papel para magdalenas", "Papel de horno"
    ],
  },
  {
    id: "salsas",
    nombre: "Aceites y Condimentos",
    icono: "🫒",
    subtipos: [
      "Aceite de oliva virgen extra", "Tomate frito", "Mayonesa", "Aceite de girasol", "Vinagre de manzana", "Ketchup", "Sal", "Pimienta negra", "Orégano", "Salsa barbacoa", "Vinagre de vino", "Aceite de oliva", "Aceite de semillas", "Aceite de coco", "Aceite de sésamo", "Aceite en spray", "Vinagre balsámico", "Vinagre de Jerez", "Vinagre de arroz", "Crema de vinagre balsámico", "Sal yodada", "Sal gruesa", "Sal en escamas", "Pimienta blanca", "Pimienta molida", "Pimentón dulce", "Pimentón picante", "Curry en polvo", "Comino", "Canela", "Nuez moscada", "Albahaca seca", "Perejil seco", "Ajo en polvo", "Cebolla en polvo", "Cúrcuma", "Jengibre en polvo", "Cayena", "Guindilla seca", "Romero seco", "Tomillo seco", "Laurel", "Hierbas provenzales", "Hierbas para paella", "Sazonador para pollo", "Sazonador para carne", "Sazonador para pescado", "Sazonador para patatas", "Sazonador para fajitas", "Sazonador para tacos", "Sazonador para barbacoa", "Colorante alimentario", "Azafrán", "Caldo concentrado", "Pastillas de caldo de pollo", "Pastillas de caldo de carne", "Pastillas de caldo de pescado", "Pastillas de caldo de verduras", "Salsa de soja", "Salsa teriyaki", "Salsa Worcestershire", "Salsa Perrins", "Mostaza", "Mostaza antigua", "Salsa brava", "Salsa alioli", "Salsa César", "Salsa rosa", "Salsa tártara", "Salsa de yogur", "Salsa de queso", "Salsa de pimienta", "Salsa de champiñones", "Salsa carbonara", "Salsa boloñesa", "Salsa pesto", "Salsa napolitana", "Salsa de tomate", "Salsa de curry", "Salsa agridulce", "Salsa picante", "Tabasco", "Salsa sriracha", "Salsa para hamburguesas", "Salsa para kebab", "Salsa para ensaladas", "Tahini", "Crema de cacahuete", "Crema de almendras", "Crema de avellanas", "Pasta de miso", "Wasabi", "Rábano picante", "Alcaparras", "Pepinillos en vinagre", "Aceitunas", "Cebollitas en vinagre"
    ],
  },
  {
    id: "dulces",
    nombre: "Dulces y Galletas",
    icono: "🍪",
    subtipos: [
      "Galletas María", "Chocolate con leche", "Chocolate negro", "Galletas con pepitas de chocolate", "Crema de cacao", "Galletas tostadas", "Mermelada de fresa", "Mermelada de melocotón", "Galletas integrales", "Galletas de avena", "Galletas de chocolate", "Galletas rellenas de chocolate", "Galletas rellenas de crema", "Galletas tipo sándwich", "Galletas de mantequilla", "Galletas de canela", "Galletas de coco", "Galletas de limón", "Galletas de jengibre", "Galletas de arroz", "Galletas sin azúcar", "Galletas sin gluten", "Galletas saladas", "Barquillos", "Galletas wafer", "Cookies", "Brownies envasados", "Bizcochos envasados", "Bizcochos de soletilla", "Lenguas de gato", "Carquiñolis", "Rosquillas dulces", "Barritas de chocolate", "Chocolate blanco", "Chocolate con almendras", "Chocolate con avellanas", "Chocolate con arroz inflado", "Chocolate relleno", "Chocolate con caramelo", "Chocolate con galleta", "Chocolate para taza", "Bombones", "Trufas de chocolate", "Pralinés", "Chocolatinas", "Barritas de chocolate y caramelo", "Caramelos duros", "Caramelos blandos", "Caramelos de menta", "Caramelos de frutas", "Caramelos sin azúcar", "Chicles", "Chicles sin azúcar", "Piruletas", "Regaliz", "Regaliz rojo", "Gominolas", "Ositos de gominola", "Nubes de azúcar", "Marshmallows", "Lacasitos", "Grageas de chocolate", "Conguitos", "Peladillas", "Chupa Chups", "Toffees", "Fresas de gominola", "Lenguas de azúcar", "Caramelos masticables", "Golosinas ácidas", "Golosinas picantes", "Turrón", "Turrón de chocolate", "Turrón de Jijona", "Turrón de Alicante", "Polvorones", "Mantecados", "Mazapán", "Roscón de Reyes", "Huesos de santo", "Panettone", "Monas de Pascua", "Bombones de licor", "Fruta escarchada", "Dátiles rellenos de chocolate", "Crema de cacao con avellanas", "Dulce de leche", "Mermelada", "Mermelada de albaricoque", "Mermelada de frutos rojos", "Mermelada de naranja", "Confitura", "Miel", "Membrillo", "Crema de cacahuete dulce", "Sirope de chocolate", "Sirope de caramelo", "Sirope de fresa", "Barritas de cereales con chocolate"
    ],
  },
  {
    id: "bebidas",
    nombre: "Bebidas Sin Alcohol",
    icono: "🥤",
    subtipos: [
      "Agua mineral", "Refresco de cola", "Refresco de cola sin azúcar", "Zumo de naranja", "Refresco de naranja", "Refresco de limón", "Cápsulas de café", "Café molido", "Agua con gas", "Bebida isotónica", "Bebida energética", "Agua sin gas", "Agua con sabores", "Agua con vitaminas", "Agua de coco", "Agua tónica", "Refresco de lima-limón", "Refresco de manzana", "Refresco de frutas", "Refresco de té", "Ginger ale", "Ginger beer sin alcohol", "Soda", "Gaseosa", "Bitter sin alcohol", "Bebida energética sin azúcar", "Bebida deportiva", "Bebida de aloe vera", "Zumo de manzana", "Zumo de piña", "Zumo de melocotón", "Zumo de uva", "Zumo de tomate", "Zumo multifrutas", "Zumo de frutos rojos", "Zumo de mango", "Zumo de pera", "Zumo de pomelo", "Néctar de frutas", "Zumo exprimido refrigerado", "Batido de chocolate", "Batido de fresa", "Batido de vainilla", "Batido de plátano", "Batido de frutas", "Batido de proteínas", "Horchata", "Granizado de limón", "Granizado de café", "Café en grano", "Café soluble", "Café descafeinado", "Café en cápsulas descafeinado", "Café listo para beber", "Café frío", "Café con leche envasado", "Preparado para cappuccino", "Preparado para chocolate caliente", "Cacao soluble", "Cacao puro para beber", "Chocolate a la taza", "Té negro", "Té verde", "Té rojo", "Té blanco", "Té matcha", "Té chai", "Té descafeinado", "Infusión de manzanilla", "Infusión de tila", "Infusión de menta poleo", "Infusión de rooibos", "Infusión de jengibre", "Infusión de frutos rojos", "Infusión de valeriana", "Infusión digestiva", "Preparado para limonada", "Limonada", "Leche merengada", "Bebida de avena", "Bebida de soja", "Bebida de almendra", "Bebida de arroz", "Bebida de coco", "Bebida de avellana", "Bebida de guisante", "Bebida vegetal con chocolate"
    ],
  },
  {
    id: "alcohol",
    nombre: "Bebidas Alcohólicas",
    icono: "🍻",
    subtipos: [
      "Cerveza en lata", "Cerveza en botellin", "Vino tinto", "Vino blanco", "Cerveza sin alcohol", "Cerveza 0,0", "Tinto de verano", "Cerveza con limon", "Cerveza tostada", "Vino rosado", "Cava", "Vermut rojo", "Ginebra", "Ron", "Whisky", "Cerveza rubia", "Cerveza negra", "Cerveza sin gluten", "Cerveza de trigo", "Cerveza artesanal", "Cerveza IPA", "Cerveza lager", "Cerveza de abadía", "Cerveza sin alcohol con limón", "Clara de cerveza", "Radler", "Sidra", "Sidra natural", "Sidra espumosa", "Sidra sin alcohol", "Vino dulce", "Vino afrutado", "Vino de mesa", "Vino ecológico", "Vino sin alcohol", "Vino espumoso", "Champagne", "Prosecco", "Lambrusco", "Vermut blanco", "Vermut rosado", "Sangría", "Kalimotxo preparado", "Rebujito preparado", "Vino de Jerez", "Oporto", "Moscatel", "Pacharán", "Licor de hierbas", "Licor de café", "Licor de crema", "Crema de whisky", "Licor de chocolate", "Licor de frutas", "Licor de manzana", "Licor de melocotón", "Licor de naranja", "Licor de avellana", "Anís", "Orujo", "Aguardiente", "Ron blanco", "Ron añejo", "Ron especiado", "Bourbon", "Whisky de malta", "Vodka", "Tequila", "Mezcal", "Brandy", "Coñac", "Pisco", "Cócteles preparados", "Mojito preparado", "Margarita preparada", "Piña colada preparada", "Gin-tonic preparado", "Spritz preparado", "Bebidas alcohólicas en lata", "Combinados preparados"
    ],
  },
  {
    id: "limpieza",
    nombre: "Limpieza y Hogar",
    icono: "🧹",
    subtipos: [
      "Bolsas de basura", "Detergente líquido para ropa", "Suavizante", "Pastillas para lavavajillas", "Lavavajillas a mano", "Lejía", "Limpiador multisuperficies", "Limpiador de suelos", "Papel de cocina", "Film transparente", "Papel de aluminio", "Estropajos", "Bayetas", "Fregonas", "Escobas", "Limpiador de cristales", "Limpiador de baños", "Limpiador de cocina", "Limpiador de acero inoxidable", "Limpiador de muebles", "Limpiador de alfombras", "Limpiador de tapicerías", "Limpiador de vitrocerámica", "Limpiador de hornos", "Limpiador de microondas", "Limpiador de juntas", "Limpiador antical", "Lejía perfumada", "Amoniaco", "Desinfectante", "Desengrasante", "Limpiador con lejía", "Limpiador de WC", "Limpiador de tuberías", "Desatascador", "Ambientador", "Ambientador en spray", "Ambientador eléctrico", "Ambientador para armarios", "Neutralizador de olores", "Eliminador de moho", "Limpiador de persianas", "Lavavajillas concentrado", "Lavavajillas en gel", "Lavavajillas para máquina", "Cápsulas para lavavajillas", "Polvo para lavavajillas", "Abrillantador para lavavajillas", "Sal para lavavajillas", "Limpiamáquinas para lavavajillas", "Desengrasante para lavavajillas", "Detergente en polvo", "Detergente en cápsulas", "Detergente para ropa blanca", "Detergente para ropa de color", "Detergente para ropa negra", "Detergente para ropa delicada", "Detergente para ropa deportiva", "Detergente para bebés", "Detergente para lana", "Suavizante concentrado", "Perlas perfumadas para ropa", "Quitamanchas", "Quitamanchas en spray", "Blanqueador para ropa", "Lejía para ropa", "Aditivo para lavadora", "Desinfectante para ropa", "Limpiador de lavadoras", "Antical para lavadora", "Toallitas atrapacolores", "Bolsas para lavar ropa delicada", "Bolsas para lavadora", "Tinte para ropa", "Estropajos metálicos", "Esponjas", "Paños de microfibra", "Paños de cocina", "Trapos de limpieza", "Recambios de fregona", "Cubos de fregar", "Recogedores", "Cepillos de limpieza", "Cepillos para WC", "Desatascadores manuales", "Guantes de limpieza", "Guantes de goma", "Plumeros", "Mopas", "Recambios de mopa", "Limpiacristales manual", "Rasquetas", "Bolsas para aspiradora", "Rodillos quitapelusas", "Quitapelusas eléctrico", "Bolsas de basura grandes", "Bolsas de basura pequeñas", "Bolsas de basura perfumadas", "Bolsas de reciclaje", "Bolsas con autocierre", "Bolsas para congelar", "Bolsas para bocadillos", "Servilletas de papel", "Manteles de papel", "Filtros de café", "Papel encerado", "Esponjas para platos", "Estropajos para ollas", "Guantes de cocina", "Pinzas de cocina", "Espátulas", "Cucharones", "Abrelatas", "Sacacorchos", "Peladores", "Ralladores", "Tijeras de cocina", "Tablas de cortar", "Recipientes para alimentos", "Fiambreras", "Botellas reutilizables", "Jarras", "Tuppers", "Tapas para recipientes", "Bolsas reutilizables", "Pinzas para cerrar bolsas", "Moldes para horno", "Bandejas de aluminio", "Fuentes para horno", "Perchas", "Cajas de almacenamiento", "Organizadores de cajones", "Cestas de almacenaje", "Cajas para zapatos", "Bolsas al vacío", "Fundas para ropa", "Bolsas para guardar ropa", "Ambientadores para armarios", "Antihumedad", "Absorbeolores", "Deshumidificadores domésticos", "Pilas", "Bombillas", "Cinta adhesiva", "Cinta aislante", "Pegamento", "Bridas", "Ganchos adhesivos", "Cuelgafácil", "Tornillos", "Tacos de pared", "Fieltros para muebles", "Protectores de suelo", "Velas", "Cerillas", "Mecheros", "Linternas", "Bolsas reutilizables para la compra", "Escobilla de baño", "Alfombrilla de baño", "Cortina de ducha", "Forro para cortina de ducha", "Colgadores de baño", "Organizadores de ducha", "Dispensador de jabón", "Portacepillos", "Toallas de baño", "Toallas de manos", "Bayetas para baño"
    ],
  },
];

export default function AddProduct() {
  const navigate = useNavigate();

  // Estados de acordeón desplegable
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(true);

  const [selectedType, setSelectedType] = useState("");
  const [typeOpen, setTypeOpen] = useState(false);
  const [customTypeInput, setCustomTypeInput] = useState("");
  const [filterText, setFilterText] = useState(""); // Estado para buscar tipos

  const [detailsOpen, setDetailsOpen] = useState(true);

  // Formulario final
  const [nombreProducto, setNombreProducto] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [descripcion, setDescripcion] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const idLista = localStorage.getItem("listaActual");

  const isCustomType = selectedType === "Otro";

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setCategoryOpen(false);
    setSelectedType("");
    setCustomTypeInput("");
    setNombreProducto("");
    setFilterText(""); // Limpiar buscador al cambiar categoría
    setTypeOpen(true);
  };

  const handleSelectType = (tipo) => {
    if (tipo === "Otro") {
      setSelectedType("Otro");
      setCustomTypeInput("");
      setNombreProducto("");
    } else {
      setSelectedType(tipo);
      setCustomTypeInput("");
      setNombreProducto(tipo);
      setTypeOpen(false);
      setDetailsOpen(true);
    }
  };

  const handleConfirmCustomType = (e) => {
    e.preventDefault();
    if (!customTypeInput.trim()) return;
    setSelectedType(customTypeInput.trim());
    setNombreProducto(customTypeInput.trim());
    setTypeOpen(false);
    setDetailsOpen(true);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setImagePreview(URL.createObjectURL(selected));
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idLista) {
      alert("No hay ninguna lista seleccionada.");
      navigate("/listas");
      return;
    }

    if (!selectedCategory || !selectedType || selectedType === "Otro") {
      setErrorMsg("Debes seleccionar una categoría y especificar un tipo válido.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      let imageUrl = "";
      if (file) {
        imageUrl = await uploadProductImage(file);
      }

      await createProduct({
        idLista,
        nombre: nombreProducto || selectedType,
        categoria: selectedCategory.nombre,
        categoriaIcono: selectedCategory.icono,
        tipo: selectedType,
        cantidad: Number(cantidad) || 1,
        descripcion,
        imagenUrl: imageUrl,
      });

      navigate("/productos");
    } catch (err) {
      console.error("Error al guardar producto:", err);
      setErrorMsg("Error al crear el producto. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar los subtipos según lo que escriba el usuario en el buscador
  const subtiposFiltrados = selectedCategory
    ? [...selectedCategory.subtipos, "Otro"].filter((tipo) =>
        tipo.toLowerCase().includes(filterText.toLowerCase())
      )
    : [];

  return (
    <div className="page-container">
      <div className="content-container mobile-layout">

        <div className="fixed-header-area">
          <div className="top-bar">
            <h1>Nuevo Producto</h1>
            <button
              type="button"
              className="profile-button"
              onClick={() => navigate("/perfil")}
            >
              👤
            </button>
          </div>
        </div>

        <div className="scrollable-products-area">

          {/* --- DESPLEGABLE 1: CATEGORÍA --- */}
          <div className="accordion-card">
            <div
              className="accordion-card-header"
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              <div
                className="accordion-circle-btn"
                style={{
                  transform: categoryOpen ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                ❯
              </div>
              <h2 className="accordion-card-title">
                {selectedCategory && !categoryOpen
                  ? `Categoría: ${selectedCategory.icono} ${selectedCategory.nombre}`
                  : "1. Selecciona categoría"}
              </h2>
            </div>

            {categoryOpen && (
              <div className="accordion-card-body">
                <div className="categories-grid">
                  {CATEGORIAS.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`category-btn ${
                        selectedCategory?.id === cat.id ? "selected" : ""
                      }`}
                      onClick={() => handleSelectCategory(cat)}
                    >
                      <span className="category-icon">{cat.icono}</span>
                      <span className="category-text">{cat.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* --- DESPLEGABLE 2: TIPO CON BUSCADOR --- */}
          {selectedCategory && (
            <div className="accordion-card">
              <div
                className="accordion-card-header"
                onClick={() => setTypeOpen(!typeOpen)}
              >
                <div
                  className="accordion-circle-btn"
                  style={{
                    transform: typeOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease-in-out",
                  }}
                >
                  ❯
                </div>
                <h2 className="accordion-card-title">
                  {selectedType && !typeOpen && selectedType !== "Otro"
                    ? `Tipo: ${selectedType}`
                    : `2. Selecciona tipo (${selectedCategory.nombre})`}
                </h2>
              </div>

              {typeOpen && (
                <div className="accordion-card-body">
                  {/* BARRA DE BÚSQUEDA PARA FILTRAR TIPOS */}
                  <input
                    type="text"
                    className="input"
                    placeholder="🔍 Buscar tipo (ej. yogur, leche...)"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    style={{ marginBottom: "12px" }}
                  />

                  <div className="subtypes-chips">
                    {subtiposFiltrados.length > 0 ? (
                      subtiposFiltrados.map((tipo) => {
                        const isOtro = tipo === "Otro";
                        const isSelected = isOtro
                          ? isCustomType
                          : selectedType === tipo;

                        return (
                          <button
                            key={tipo}
                            type="button"
                            className={`subtype-chip ${isSelected ? "selected" : ""}`}
                            onClick={() => handleSelectType(tipo)}
                          >
                            {tipo}
                          </button>
                        );
                      })
                    ) : (
                      <p style={{ textAlign: "center", color: "#718096", fontSize: "13px", padding: "10px" }}>
                        No se encuentra ningún tipo. Selecciona <strong>"Otro"</strong> para escribir uno personalizado.
                      </p>
                    )}
                  </div>

                  {isCustomType && (
                    <div className="custom-type-container">
                      <span className="custom-type-label">
                        ✍️ Escribe el tipo personalizado:
                      </span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          className="input custom-type-input"
                          placeholder="Ej. Salmón ahumado..."
                          value={customTypeInput}
                          onChange={(e) => setCustomTypeInput(e.target.value)}
                          autoFocus
                        />
                        <button
                          type="button"
                          className="secondary-button"
                          style={{ width: "auto", padding: "0 16px" }}
                          onClick={handleConfirmCustomType}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* --- DESPLEGABLE 3: FORMULARIO DETALLES --- */}
          {selectedCategory && selectedType && selectedType !== "Otro" && (
            <div className="accordion-card">
              <div
                className="accordion-card-header"
                onClick={() => setDetailsOpen(!detailsOpen)}
              >
                <div
                  className="accordion-circle-btn"
                  style={{
                    transform: detailsOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease-in-out",
                  }}
                >
                  ❯
                </div>
                <h2 className="accordion-card-title">
                  3. Detalles del producto
                </h2>
              </div>

              {detailsOpen && (
                <div className="accordion-card-body">
                  <form onSubmit={handleSubmit}>
                    <input
                      className="input"
                      placeholder="Nombre del producto"
                      value={nombreProducto}
                      onChange={(e) => setNombreProducto(e.target.value)}
                      required
                    />

                    <div className="quantity-row">
                      <span className="quantity-label">Cantidad:</span>
                      <input
                        type="number"
                        min="1"
                        className="input quantity-input"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                      />
                    </div>

                    <textarea
                      className="input"
                      placeholder="Descripción / Observaciones (ej. marca, formato...)"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      rows={3}
                    />

                    <div className="file-upload-container">
                      {!imagePreview ? (
                        <label className="file-upload-label">
                          📷 Adjuntar foto/imagen
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                          />
                        </label>
                      ) : (
                        <div className="image-preview-badge">
                          <img
                            src={imagePreview}
                            alt="Vista previa"
                            className="image-preview-thumb"
                          />
                          <span className="image-preview-text">Imagen lista</span>
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={handleRemoveImage}
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>

                    {errorMsg && (
                      <div style={{ color: "#e53e3e", fontSize: "13px", marginBottom: "12px", fontWeight: "bold" }}>
                        ⚠️ {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="primary-button"
                      disabled={loading}
                    >
                      {loading ? "GUARDANDO..." : "CREAR PRODUCTO"}
                    </button>

                    <button
                      type="button"
                      className="secondary-button"
                      style={{ marginTop: "10px" }}
                      onClick={() => navigate("/productos")}
                    >
                      CANCELAR
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>

        <Navbar />

      </div>
    </div>
  );
}