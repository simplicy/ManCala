import { useRouter } from "next/router";
import { Input } from '@material-ui/core';
import styles from '../styles/custom.module.css'
import { useState } from "react";

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
            <div>
                <Input 
                className={styles.searchBar} 
                placeholder="Search by Name or Account Number" 
                type="text" 
                onChange={(e)=>{handleSearch(e.target.value)}}/>
            </div>          
            <div className={styles.yscroll, styles.accGrid}>
                <div className={styles.grid}>
                { AllAccounts.length > 0 ? (
                    AllAccounts.filter(item => { return (item.name.toLowerCase().includes(searchQuery) || item.id.includes(searchQuery))}).map((acc, index) => (
                        <a href={"/accounts/"+acc.id} style={{textDecoration:"none",color: "inherit"}}>
                            <div id={index} className={styles.accountCard} >
                                <h4>{acc.name}</h4>  
                                <h5>{acc.id}</h5>                                   
                            </div>
                        </a>     
                    )
                )):
                (
                    <h2 className="subtitle">
                    No Accounts Found
                    </h2>
                )     
                }
                </div>
            </div>
          </>
    );
}
export default AccountList;

        