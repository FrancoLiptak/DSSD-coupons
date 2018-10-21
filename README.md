# Supermarket-DSSD | 2018 | Etapa 2

## Grupo 1:

- Liptak, Franco Emanuel
- Onofri, Camila
- Raimondi, Sebastián

## Alojamiento del servicio

La API está alojada en Heroku: https://dssd-coupons.herokuapp.com/

## Fundamentación de tecnologías elegidas

Al igual que en la primer entrega, el grupo eligió trabajar con Express (intraestructura de aplicaciones web Node.js). El framework fue elegido por la facilidad que provee al programador para crear APIs sólidas, de manera rápida y sencilla. En esa oportunidad se eligió trabajar con Node.js por su popularidad, rendimiento, flexibilidad de desarrollo, entre otras ventajas.
Todas esas ventajas provocaron que decidamos volver a usar la tecnología para esta segunda entrega.

La base de datos utilizada es PostgreSQL, ya que decidimos deployar nuestra API en Heroku (Heroku solo ofrece PostgreSQL como motor de bases de datos gratuito).

Elegimos Heroku como servicio para exponer nuestra API por su facilidad de uso y buen rendimiento. Además, el grupo ya tenía experiencia usándolo.

## Endpoints


**GET /api/v1.0/coupons** - Lista todos los cupones.

- Ejemplo de uso:

curl http://dssd-coupons.herokuapp.com/api/v1.0/coupons

**GET /api/v1.0/coupons/:id** - Devuelve el cupón que se indica por el parámetro numérico *id*.

- Ejemplo de uso:

curl http://dssd-coupons.herokuapp.com/api/v1.0/coupons/1

**POST /api/v1.0/coupons** - Permite la creación de un cupón. Es necesario pasarle dos parámetros:

- Number: Número de cupón.
- Used: Flag que indica si el cupón fue usado o no.

- Ejemplo de uso:

curl -X POST --data "number=123&used=B"0"" http://dssd-coupons.herokuapp.com/api/v1.0/coupons

**PUT /api/v1.0/coupons/:id** - Permite actualizar un cupón. Los campos que se permiten modificar son los mismos que los nombrados anteriormente.

- Ejemplo de uso:

curl -X PUT --data "number=1234&used=B"0"" http://dssd-coupons.herokuapp.com/api/v1.0/coupons/2

**DELETE /api/v1.0/coupons/:id** - Permite eliminar un cupón.

- Ejemplo de uso:

curl -X DELETE http:/dssd-coupons.herokuapp.com/api/v1.0/coupons/3
