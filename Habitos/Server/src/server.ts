//Back-end API Restful --> Acesso a Recursos e entidades de criacao, remocao e alteracao através de rotas HTTP
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes'

const port = 3333
const app = Fastify()

//A partir disso, o frontend já consegue acessar os dados do backend
//Obs: é possível escolher quais endereços do meu frontend podem acessar meu backend {origin: 'http://localhost:3000'}
app.register(cors) 
app.register(appRoutes)

app.listen({
    port: port,
}).then(() => {
    console.log('HTTP server running on localhost:' + port)
})


