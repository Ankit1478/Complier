
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Compiler } from './components/complier'
import { QuestionList } from './components/Questionlist'
import { AddQuestion } from './components/Add'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuestionList></QuestionList>} ></Route>
        <Route path="/question/:id" element={<Compiler></Compiler>} />
        <Route path='/addquestion' element={<AddQuestion></AddQuestion>}></Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
