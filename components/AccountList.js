import { useRouter } from "next/router";
import { Input } from '@material-ui/core';
import styles from '../styles/custom.module.css'

const AccountList = ({accounts}) => {
    const router = useRouter();
    const AllAccounts = accounts.map(item =>{
        return item;
    });
    var searchQuery = "";
    const handleSearch = (value) => {
        if(value==null){
            searchQuery=searchQuery.substring(0,searchQuery.length-1)
        }            
        else{
            searchQuery+=value.toLowerCase()
        }      
        AllAccounts.forEach((element, index) => {
            const search = element.name.toLowerCase().includes(searchQuery) || element.id.includes(searchQuery)
            if(search) document.getElementById(index).style.display=""
            else document.getElementById(index).style.display="none"
        });
    }
    return (
        <>
            <div>
                <Input className={styles.searchBar} placeholder="Search by Name or Account Number" type="text" onChange={(e)=>{handleSearch(e.nativeEvent.data)}}/>
            </div>          
            <div className={styles.yscroll, styles.accGrid}>
                <div className={styles.grid}>
                { accounts.length > 0 ? (
                accounts.map((acc, index) => (
                    <div id={index} 
                    className={styles.accountCard} 
                    onClick={()=>{router.push("/accounts/"+acc.id)}}>
                        <a>
                            <h4>{acc.name}</h4>  
                            <h5>{acc.id}</h5>
                        </a>                                      
                    </div>     
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

        