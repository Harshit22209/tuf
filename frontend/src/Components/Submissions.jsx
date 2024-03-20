import React,{useEffect,useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Submissions = () => {
    const [submissions, setSubmissions] = useState([]);
    axios.defaults.baseURL = 'http://localhost:5000';
    const navigate=useNavigate();
    useEffect(() => {
        const fetchSubmissions=async()=>{
           try{
            
            const response =await axios.get('/codeSnippets');
        
            console.log(response.data)
            setSubmissions(response.data)
           }
          catch(error ) {
            console.error('Error fetching code snippets:', error);
          };
        }
        fetchSubmissions();
        
      }, []);
  return (
    <div>
        <div className='flex justify-center'>
        <button onClick={()=>navigate("/")} className='w-[50vh] border-2 mb-5 p-2 bg-blue-500 text-white text-xl'>Add</button>
        </div>
       <table className="ml-10 w-[200vh] bg-white border-y-2 border-gray-300">
      <thead>
        <tr>
        <th className="border-b-2 p-2 border-l-2">Id</th>
          <th className="border-2 p-2">Username</th>

          <th className="border-b-2 p-2 border-l-2">Language</th>
          <th className="border-b-2 p-2 border-l-2">TimeStamp</th>
          <th className="border-b-2 p-2 border-l-2">CODE</th>
          <th className="border-b-2 p-2 border-l-2">STDIN</th>
          <th className="border-2 p-2 border-l-2">STDOUT</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((submission,index) => (
          <tr key={index}>
            <td className="border p-2">{index}</td>
            <td className="border p-2">{submission.username}</td>

            
            <td className="border p-2">{submission.language}</td>
            <td className="border p-2">{submission.timestamp}</td>
            <td className="border p-2">{submission.source_code_preview}</td>
            <td className="border p-2">
              {submission.stdin}
              
            </td>
            <td className="border p-2">
                {submission.stdout}              
            </td>
          </tr>
        ))}
      </tbody>
    </table>     


    </div>
  )
}

export default Submissions