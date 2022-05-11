import { useRouter } from "next/router";
import { useState } from "react";
import { Card, Grid } from "@mui/material"
import TextField from '@mui/material/TextField';

const AccountList = ({accounts}) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const AllAccounts = accounts.map(item =>{
        return item;
    });
    const handleSearch = (value) => {
        setSearchQuery(value || "")
    }
    
    return (
        <>
            <Card style={{padding:"10px", margin: "10px"}}>
                <Grid  container spacing={2}>
                    <Grid item xs={1}/>
                    <Grid item xs={10}>
                        <TextField 
                            sx={{ width: "100%" }}
                            label="Search"
                            color="primary"
                            placeholder="Search by Name or Account Number" 
                            type="text" 
                            onChange={(e)=>{handleSearch(e.target.value)}}
                        />
                    </Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={12}/>
                    
                    <Grid container item xs={12} style={{maxHeight: "30em", overflow: 'auto'}}>
                        { AllAccounts.length > 0 ? (
                        AllAccounts.filter(item => { return (item.name.toLowerCase().includes(searchQuery) || item.id.includes(searchQuery))}).map((acc, index) => (
                            <Grid item xs={6}>
                                <a href={"/accounts/"+acc.id} style={{textDecoration:"none",color: "inherit"}}>
                                    <Card 
                                        id={index} 
                                        style={{padding:"10px", margin: "10px"}} 
                                        sx={{':hover': {boxShadow: 20,},}}
                                        >
                                        <h4>{acc.name}</h4>  
                                        <h5>{acc.id}</h5>                                   
                                    </Card>
                                </a>   
                            </Grid> 
                        )
                        )):
                        (<h2 className="subtitle">
                            No Accounts Found
                        </h2>)     
                        }
                    </Grid>
                </Grid>  
            </Card>    
          </>
    );
}
export default AccountList;

        