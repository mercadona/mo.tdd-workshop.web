# Schemas

## Product

### Input properties (From where to get the data)
- id -> categories[i].products[i].id
- slug: categories[i].products[i].slug
- display_name: categories[i].products[i].display_name
- nutriscore: no existe, se inventa
- image: categories[i].products[i].thumbnail pero canbiando a ?fit=crop&h=600&w=600
- thumbnail: categories[i].products[i].thumbnail
- price: categories[i].products[i].price_instructions.unit_price
- referenceFormat: categories[i].products[i].price_instructions.reference_format
- categoryId: categories[i].products[i].price_instructions.categories[0].id

### Output properties
- id: number
- slug: string
- displayName: string
- nutriscore: A | B | C | D
- image: string
- thumbnail: string
- price: number
- referenceFormat: kg | ud
- categoryId: number


## Category

### Output properties
- id: number
- displayName: Aperitivos | Cereales | Fruta y verdura
- slug: aperitivos | cereales | fruta-y-verdura
