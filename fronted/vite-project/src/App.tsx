
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Compiler } from './components/complier'
import { QuestionList } from './components/Questionlist'
import { AddQuestion } from './components/Add'
import Landing from './components/LandingPage'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing></Landing>} ></Route>
        <Route path='/allquestion' element={<QuestionList></QuestionList>}></Route>
        <Route path="/question/:id" element={<Compiler></Compiler>} />
        <Route path='/addquestion' element={<AddQuestion></AddQuestion>}></Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
