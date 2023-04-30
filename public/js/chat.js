const socket = io()

// socket.on('countUpdated',(counts)=>{
//     console.log('The count has been Updated!',counts)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked')
//     socket.emit('increment')
// })
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButon = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML
const userLocation = document.querySelector("#Location-message-template").innerHTML
const sidebarTemplate = document.querySelector('#chat__sidebar').innerHTML
const username = document.querySelectorAll("#username")
const room = document.getElementById("#room")
const id = socket.id

const autoscroll =()=>{
       
        const $newMesssage = $messages.lastElementChild
        const newMesssageStyles = getComputedStyle($newMesssage)
        const newMessageMargin = parseInt(newMesssageStyles.marginBottom)
        const newMesssageHeight = $newMesssage.offsetHeight + newMessageMargin


        const visibleHeight = $messages.offsetHeight

        const containerHeight = $messages.scrollHeight

        const scrollOffset = $messages.scrollTop + visibleHeight    
        
        if (containerHeight - newMesssageHeight <= scrollOffset){
            $messages.scrollTop = $messages.scrollHeight
            
        }
        
    }
    
socket.on('messages',(message)=>{
    console.log(message)
     const html = Mustache.render(messageTemplate,{
         username: message.username,
         message: message.message,
         createdAt: moment(message.createdAt).format("HH:mm a")
     })
     $messages.insertAdjacentHTML('beforeend',html)
     autoscroll()
})
socket.on('LocationMessage',(data)=>{
    console.log(data)
   const html = Mustache.render(userLocation,{
    username: data.username,
    url:data.url,
    createdAt:moment(data.createdAt).format("HH:mm a")

   })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
    
})

socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#chat__sidebar').innerHTML = html
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButon.setAttribute('disabled','disabled')
    const message = document.querySelector('input').value

    socket.emit('sendMessage',(message),(error)=>{
        $messageFormButon.removeAttribute('disabled')
        $messageFormInput.value = ' '
        $messageFormInput.focus()
        console.log('The message was delivered',message)
        if(error){
            return console.log(error)
        }
    })
})

$sendLocationButton.addEventListener('click',()=>{
    if (!navigator.geolocation){
        return alert('Geolocation is not supported for your location')
    }
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        socket.emit('sendLocation',{
            latitude: position.coords.latitude ,
            longitude: position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared!')
        })

    })
})

socket.emit('join',{id,username,room}) 