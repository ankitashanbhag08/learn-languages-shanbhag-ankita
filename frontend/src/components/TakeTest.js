import React, {useState, useEffect} from "react";
import '../styles/style.css'
import {Box, TextField, MenuItem, Button, Stack} from '@mui/material';

const axios = require('axios')

const TakeTest = ()=>{
    const languages = ["English", "Finnish"]
    const [langObj, setLangObj] = useState({lang1:"", lang2:"", category:""})
    const [allTags, setAllTags] = useState([])
    const [allQuestions, setAllQuestions] = useState([])
    const [answer, setAnswer] = useState("")

    const handleInput = (event) =>{
        let name = event.target.name
        let value = event.target.value
        console.log(name + ":" + value)
        setLangObj({...langObj, [name]:value})
    }

    const handleTest = async (event)=>{
        console.log(langObj)
        const hr = await axios.get(`http://localhost:8080/teach/qstns?lang1=${langObj.lang1}&catId=${langObj.category}`, langObj)
        console.log(hr.data)
        setAllQuestions(hr.data)
    }

    const submitAnswer = (value)=>{
          console.log(value)
                
    }

    const verify = ()=>{
        console.log(allQuestions)
    }
    async function getTags(){
        const resp = await axios.get('http://localhost:8080/teach/tags')
        console.log(resp)
        setAllTags(resp.data)
    }
    useEffect(() =>{
        getTags();
    }, [])
    return(
        <>
            <div className="test-container">
                <h3>Take Test</h3>

            </div>
             <Box component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                    marginLeft:'22rem'
                }}>
                 <TextField
                    id="outlined-select-currency"
                    select
                    label="I know"
                    value={langObj.lang1} 
                    name="lang1"
                    onChange={handleInput}
                    helperText="Select language that you know"
                    required >
                    {languages.map((item, index) => (
                        <MenuItem key={index} value={item}> 
                        {item}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="outlined-select-currency"
                    select
                    label="I want to learn"
                    value={langObj.lang2}
                    name="lang2"
                    onChange={handleInput}
                    helperText="Select what you want to learn"
                    required>
                    {languages.map((item, index) => (
                        <MenuItem key={index} value={item}> 
                        {item}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="outlined-select-currency"
                    select
                    label="Question Category"
                    value={langObj.category}
                    name="category"
                    onChange={handleInput}
                    helperText="If blank, questions will have random categories"
                    required>
                        <MenuItem value="">None</MenuItem>
                    {allTags.map((tag) => (
                        <MenuItem  key={tag.id} value={tag.id}> 
                        {tag.NAME}
                        </MenuItem>
                    ))}
                </TextField>                              
             </Box> 
             <Stack  direction="row" sx={{marginLeft:'38rem'}}>               
                 <Button variant="contained" onClick={handleTest}>Start Test</Button>
            </Stack> 
        <table>
        
        
        <tbody>
            {
                (allQuestions.length !== 0) ? 
                <tr>
                <th>Word</th>
                <th>Answer</th>
                <th>Correct Answer</th>
                </tr> :
                null
            }
                        
        </tbody>
        {allQuestions.map((element) => {
            return (
              <tbody key={element.id}>
                <tr>
                  
                  <td>{element.word}</td>
                  <td>
              <input
                type="text"
                className="inputBox"
                name={`text${element.id}`}
                value={element.text}
                 onBlur={(e)=>submitAnswer(e.target.value)}
              />
            </td>
                  <td></td>
                  
                </tr>
              </tbody>
            );
          })}
      </table> 
      {(allQuestions.length !== 0)    ? 
          <Stack  direction="row" sx={{marginLeft:'38rem'}}>               
                 <Button variant="contained" onClick={verify}>Verify Answer</Button>
            </Stack>
         : null
        }
        </>
    );
}

export default TakeTest;