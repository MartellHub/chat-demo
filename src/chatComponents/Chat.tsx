// import React from 'react'

function Chat() {
  return (
    <div className=" bg-amber-200 p-5 w-full">
      <div className="bg-purple-500/45 rounded-2xl h-full w-full flex ">
      <div className="flex w-[25%] justify-center border rounded-l-2xl">left</div>
      <div className="flex flex-1 justify-center border-t border-b">center</div>
      <div className="flex w-[25%] justify-center border rounded-r-2xl">right</div>
      
      </div>
    </div>
  )
}

export default Chat