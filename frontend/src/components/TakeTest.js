import React, {useState, useEffect} from "react";
import '../styles/style.css'
import {Box, TextField, MenuItem, Button, Stack} from '@mui/material';
import {Table, 
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, 
    Paper} from '@mui/material';
import { styled, tableCellClasses } from '@mui/material';

//Styles Table Cells (header and body)
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const axios = require('axios')

const TakeTest = ()=>{
    //Const variable containing array of languages available in the system.
    const languages = ["English", "Finnish", "German"]
    //hook object containing the values that we filled in the fields.
    const [langObj, setLangObj] = useState({lang1:"", lang2:"", category:""})
    //hook for categories/tags
    const [allTags, setAllTags] = useState([])
    //hook containing the list of words, translated words, categories and answer given by user.
    const [allQuestions, setAllQuestions] = useState([])
    //sets messages on screen
    const [err, setErr] = useState("")
    //hook that updates whenever "Verify" button is clicked. Also makes the user's answer field(s) readonly.
    const [verify, setVerify] = useState(false)
    //updates score
    const[score, setScore] = useState(0)
    //Called when value is changed in any of the text fields/dropdown
    const handleInput = (event) =>{
        let name = event.target.name
        let value = event.target.value
        console.log(name + ":" + value)
        setLangObj({...langObj, [name]:value})
    }
    //Called when "Start Test" is clicked.
    const handleTest = async (event)=>{
        setVerify(false)
        console.log(langObj)
        if(langObj.lang1 === langObj.lang2){
            setErr("Select different languages")
            return false
        } 
        if(!langObj.lang1 || !langObj.lang2){
            setErr("Select both language options")
            return false
        }
        setErr("")
        //gets questions and answers from database.
        const hr = await axios.get(`http://localhost:8080/teach/qstns?lang1=${langObj.lang1}&lang2=${langObj.lang2}&catId=${langObj.category}`)
        console.log(hr.data)
        setAllQuestions(hr.data)
    }
    //sets every fields back to the initial state 
    const handleReset = () => {
        setLangObj({lang1:"", lang2:"", category:""})
        setAllQuestions([])
        setErr("")
        setVerify(false)
        setScore(0)
    }
    //called when any of answer field in blurred. Saves the state of blurred answer fields.
    const submitAnswer = (e)=>{        
        let name = e.target.name
          let value = e.target.value  
           setAllQuestions(allQuestions.map((item)=>{
               if(Number(item.id)===Number(name)){
                   console.log(item)
                   return({...item,
                    wordTest:value})
               }               
               return item
           }))
    }
    /*Called when the user clicks on "verify" button. 
    Compares user's answers with correct answer and generates the score. */
    const verifyAnswer = ()=>{
        let i = 0
        setVerify(true)
        for(let item of allQuestions){
            if(item.wordTest){
                if(item.word2.toLowerCase()===item.wordTest.toLowerCase()) i++  //answers need not be same case
            }
            
        }        
        setScore(i)
        console.log(allQuestions)
    }
    //gets a list of categories from the database.
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
          <div className="test-heading">
                <h2>Take Test</h2>
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
                <div className="create-messages">
                    {err}
                </div> 
                                             
             </Box> 
             <Stack  direction="row" spacing={3} sx={{marginLeft:'38rem'}}>               
                 <Button variant="contained" onClick={handleTest}>Start Test</Button>
                 <Button variant="contained" onClick={handleReset}>Reset All</Button>
            </Stack>
        <TableContainer sx={{ maxWidth: 850, borderRadius: 5, margin: 'auto', marginTop:'1rem' }} component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="spanning table">
                {(allQuestions.length !== 0) ? 
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" colSpan={3}>
                                    Translate these words and click on "Verify Answer" to generate score 
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell align="center">Word</StyledTableCell>
                                <StyledTableCell align="center">Your Answer</StyledTableCell>
                                {verify ? <StyledTableCell align="center">Correct Answer</StyledTableCell> : null}                                
                            </TableRow>
                        </TableHead> 
                : null }
                
                {allQuestions.map((element) => {
                    return (
                    <TableBody key={element.id}>
                        <TableRow>
                        <TableCell align="center">{element.word1}</TableCell>
                        <TableCell align="center">
                            <input
                                type="text"
                                className="inputBox"
                                name={element.id}
                                value={element.word3}
                                disabled={verify ? "disabled" : ""}
                                onBlur={(e)=>submitAnswer(e)}
                                
                            />
                        </TableCell>
                            {verify ? <TableCell align="center">{element.word2}</TableCell> : null }
                        </TableRow>
                                        
                    </TableBody>
                    );
                })}

                {verify ? 
                    <TableBody>
                        <TableRow>
                            <TableCell rowSpan={3}></TableCell>
                            <TableCell rowSpan={2}>Your Score:</TableCell>
                            <TableCell>{score} / {allQuestions.length}</TableCell>
                        </TableRow>
                    </TableBody>
                   : null}

                
            </Table>
            
        </TableContainer> 
       
      {(allQuestions.length !== 0)    ? 
          <Stack  direction="row" sx={{marginLeft:'38rem', marginBottom:'2rem', marginTop:'2rem'}}>               
                 <Button variant="contained" onClick={verifyAnswer}>Verify Answer</Button>
            </Stack>
         : null
        }
        </>
    );
}

export default TakeTest;