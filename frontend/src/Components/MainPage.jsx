import React,{useState,useEffect} from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    axios.defaults.baseURL = 'http://localhost:5000';
    const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('python');
  const [stdin, setStdin] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [compiling,setCompiling]=useState(false);
  const navigate=useNavigate();
  
  

  const handleSubmit = async(event) => {
    event.preventDefault();
    const info={username,language,stdin,sourceCode}
    console.log(info);
    
    setCompiling(true);
    await axios.post('/submit', info)
      .then(response => {
        setCompiling(false);
        alert(response.data.message);
      })
      .catch(error => {
        alert(error.response.data.message);
        setCompiling(false);
      });
  };

  return (
    <div className='flex justify-center mt-3 '>
        <div>
       <div>
        <button onClick={()=>navigate("/submissions")} className='border-2 mb-5 p-2 bg-blue-500 text-white' >Show Submissions</button>
        </div>
        <div><form onSubmit={handleSubmit}>
    <div><input className='border-2 mb-2 rounded-sm border-slate-500' type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
    </div>
    <div>
    <label htmlFor="type">Language: </label>
            <select className="border-2 mb-2 border-slate-500" name="type" id="type" onChange={(e)=>setLanguage(e.target.value)}>
            <option value="python">PYTHON</option>
              <option value="java">JAVA</option>
              <option value="cpp">C++</option>
              

              <option value="javascript">JAVASCRIPT</option>
              
            </select>
    </div>
    <div>    <textarea className='border-2 mb-2 border-slate-500 w-[35vh] h-[20vh]' placeholder="Standard Input" value={stdin} onChange={e => setStdin(e.target.value)} />
    </div>
    <div>
    <textarea className="border-2 mb-2 w-[100vh] h-[50vh] border-slate-500" placeholder="Source Code" value={sourceCode} onChange={e => setSourceCode(e.target.value)} />
    </div>
      <button className="border-2 p-2 mb-1 bg-green-500 text-white" type="submit">Submit</button>
      {compiling && <span>Compiling...</span>}
    

  </form>
  </div>
  </div>
  </div>
  )
}

export default MainPage