import { Actor, CollisionType, Color, Engine, Font, FontUnit, Label, Loader, Sound, Text, vec } from "excalibur"

const game = new Engine({
    width: 800,
    height: 600
})


const barra = new Actor({
    x: 150,
    y: game.drawHeight - 40,
    width: 10,
    height: 20,
    color: Color.Chartreuse
})

barra.body.collisionType = CollisionType.Fixed

game.add(barra)

game.input.pointers.primary.on("move", (event) => {
    barra.pos.x = event.worldPos.x
})

const bolinha = new Actor({
    x: 100,
    y: 300,
    radius: 10,
    color: Color.Red
})

bolinha.body.collisionType = CollisionType.Passive

let coresBolinha =  [
    Color.Black,
    Color.Chartreuse,
    Color.Cyan,
    Color.Green,
    Color.Magenta,
    Color.Orange,
    Color.Red,
    Color.Rose,
    Color.White,
    Color.Yellow
    ]

    let numeroCores = coresBolinha.length

const velocidadeBolinha = vec(700, 700)

setTimeout(() => {
    bolinha.vel = velocidadeBolinha
}, 1000)

bolinha.on("postupdate", () => {
    if (bolinha.pos.x < bolinha.width / 2) {
        bolinha.vel.x = velocidadeBolinha.x
    }

    if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
        bolinha.vel.x = velocidadeBolinha.x * -1
    }

    if (bolinha.pos.y < bolinha.height / 2) {
        bolinha.vel.y = velocidadeBolinha.y
    }

    // if (bolinha.pos.y + bolinha.height /2 > game.drawHeight){
    //     bolinha.vel.y = -velocidadeBolinha.y
    // }
})


game.add(bolinha)


const padding = 20

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 3

const corBloco = [Color.Red, Color.Orange, Color.Yellow]

const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
// const larguraBloco = 136
const alturaBloco = 30

const listaBlocos: Actor[] = []

for (let j = 0; j < linhas; j++) {

    for (let i = 0; i < colunas; i++) {
        listaBlocos.push(
            new Actor({
                x: xoffset + i * (larguraBloco + padding) + padding,
                y: yoffset + j * (alturaBloco + padding) + padding,
                width: larguraBloco,
                height: alturaBloco,
                color: corBloco[j]
            })
        )
    }
}




listaBlocos.forEach(bloco => {
    bloco.body.collisionType = CollisionType.Active


    game.add(bloco)
})

let pontos = 0

const textoPontos = new Label({
    text: pontos.toString(),
    font: new Font({
        size: 40,
        color: Color.White,
        strokeColor: Color.Black,
        unit: FontUnit.Px
    }),
    pos: vec(600, 500)

})



game.add(textoPontos)

// const textoPontos = new Text({
//     text: "hello world",
//     font: new Font ({size: 20})
// })

// const objetoTexto = new Actor({
//     x: game.drawWidth - 80,
//     y: game.drawHeight - 15
// })

// objetoTexto.graphics.use(textoPontos)

// game.add(objetoTexto)


let colidindo: boolean = false

const efeitos = new Sound("./src/efeitos/som.mp3");
const gameOversom = new Sound("./src/efeitos/roblox.mp3")
const loader = new Loader([efeitos, gameOversom]);

bolinha.on("collisionstart", (event) => {
    if (pontos != 15) {
        console.log("colidiu com", event.other)

        if (listaBlocos.includes(event.other)) {
            event.other.kill()

            efeitos.play();

            pontos++

            bolinha.color = coresBolinha[ Math.trunc( Math.random () * numeroCores)]


            textoPontos.text = pontos.toString()

        }

        let interseccao = event.contact.mtv.normalize()

        if (!colidindo) {
            colidindo = true

            if (Math.abs(interseccao.x) > Math.abs(interseccao.y)) {
                bolinha.vel.x = bolinha.vel.x * -1
            } else {
                bolinha.vel.y = bolinha.vel.y * -1
            }

        }
    } else {
        alert("Terminou :D")
        window.location.reload()
    }


})



bolinha.on("collisionend", () => {
    colidindo = false
    
})

bolinha.on("exitviewport", () => {

    gameOversom.play(1)
    .then (() => {
    alert("E Morreu")
    window.location.reload()

    })
})


await game.start(loader)