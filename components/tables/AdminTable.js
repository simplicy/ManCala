import { useState } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import AddIcon from '@mui/icons-material/Add';
import FormModal from '../modals/FormModal'
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import Input from '@mui/material/Input';
import DialogModal from '../modals/DialogModal';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}



function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const headCells = [

    {
      id: 'name',
      numeric: true,
      disablePadding: false,
      label: 'Name',
    },
    {
      id: 'email',
      numeric: true,
      disablePadding: false,
      label: 'Email',
    },
  ];


  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const router = useRouter()
  const { numSelected, content, selected, edit, setEdit, name, num, email, session } = props;
  const [showAdd, setShowAdd] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [payload, setPayload] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const deleteOptions = {
    path: '/api/admins',
    method: 'DELETE',
  }
  const saveOptions = {
    path: '/api/admins',
    method: 'PUT',
  }
  const onAddClick = async () => {
    setShowAdd(true);
  }
  const onDelete = async () => {
    setPayload(selected)
    setShowDelete(true)

  }
  const onEdit = async () => {
    if (selected.length == 1) {
      setEdit(true)
      var e = document.getElementsByName(selected[0].id)
      for (var n = 0; n < e.length; n = n + 2) {
        e[n].style.display = "none"
        e[n + 1].style.display = ""
      }
    }
    else if (selected.length > 1) {
      setEdit(false)
      toast("Only 1 account can be edited at a time.")
    }
  }
  const onCancel = async () => {
    setEdit(false)
    var e = document.getElementsByName(selected[0].id)
    for (var n = 0; n < e.length; n = n + 2) {
      e[n].style.display = ""
      e[n + 1].style.display = "none"
    }
  }
  const onSave = async () => {
    if (name == '' && email == '' && num == '') {
      toast('No changes made.')
      onCancel();
    }
    const validateEmail = () => {
      return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    };
    if (validateEmail || email == '') {
      num = selected[0].id
      if (name == '') {
        name = selected[0].name
      }
      if (email == '') {
        email = selected[0].email
      }
      setPayload({
        old: selected,
        new: {
          id: num,
          name: name,
          email: email,
        }
      })
      setShowSave(true);

    } else {
      toast("Not a valid email address.")
    }

  }
  const onSubmit = async data => {
    const req = await fetch('/api/admins', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const json = await req.json()
    toast(json.message)
    if (json.success == true) {
      var logContent = {
        group: 'admins',
        data: JSON.stringify(data),
      }
      const loggit = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          user: session.user.email,
          payload: JSON.stringify(logContent),
        }),
      })
      const loggitJson = await loggit.json()
      if (loggitJson.success == true) {
        setShowAdd(false)
        router.reload(window.location.pathname);
      }
    }
  }
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {content}
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          {numSelected == 1 ? (
            <>
              {edit ? (
                <>
                  <Tooltip onClick={() => { onCancel() }} title="Cancel">
                    <IconButton>
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                  <DialogModal show={showSave} onClose={() => setShowSave(false)} session={session} payload={payload} options={saveOptions} title={"Save changes?"}>
                    Are you sure you want to overwrite this row?
                  </DialogModal>
                  <Tooltip onClick={() => { onSave() }} title="Save">
                    <IconButton>
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Tooltip onClick={() => { onEdit() }} title="Edit">
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )
              }
            </>
          ) : (
            null
          )}
          <DialogModal show={showDelete} onClose={() => setShowDelete(false)} session={session} payload={payload} options={deleteOptions} title={"Delete selected?"}>
            Are you sure? This action cannot be undone.
          </DialogModal>
          <Tooltip onClick={() => { onDelete() }} title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <FormModal onClose={() => setShowAdd(false)} show={showAdd} payload={payload} options={saveOptions} onSubmit={handleSubmit(onSubmit)} title={"Add Account"}>
            <form>
              <div>
                <Input type="text" placeholder="First Last" {...register("name", { required: true })} />
                <br />
                <br />
                <Input type="email" placeholder="example@cmscom.co" {...register("email", { required: true, })} />
              </div>
            </form>
          </FormModal>
          <Tooltip onClick={() => { onAddClick() }} title="Add">
            <IconButton>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Toolbar>

  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState([]);
  const [AccountNumber, setAccountNumber] = useState('');
  const [AccountName, setAccountName] = useState('');
  const [AccountEmail, setAccountEmail] = useState('');
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { rows, title, session } = props;
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (!edit) {
      if (event.target.checked) {
        const newSelecteds = rows.map((n) => n);
        setSelected(newSelecteds);
        console.log(newSelecteds)
        return;
      }
      setSelected([]);
    }
  };
  //need to change to allow all data to be selected
  const handleClick = (event, row) => {
    var selectedIndex = -2;
    if (!edit) {
      selected.find((data, index) => {
        if (data.id == row.id) {
          selectedIndex = index;
        }
      })
      if (selectedIndex === -2) {
        selectedIndex = -1;
      }
      let newSelected = [];
      if (selectedIndex == -1) {
        newSelected = newSelected.concat(selected, row);
      } else if (selectedIndex == 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex == selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
      setSelected(newSelected);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const isSelected = (row) => {
    const isSel = selected.find((data) => {
      if (data.id == row.id)
        return true;
      return false;
    })
    if (typeof isSel == 'undefined')
      return false;
    return true;
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '75%' }}>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Toaster />
        <EnhancedTableToolbar
          numSelected={selected.length}
          content={title}
          selected={selected}
          edit={edit}
          setEdit={setEdit}
          num={AccountNumber}
          name={AccountName}
          email={AccountEmail}
          session={session}
        />
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table
            aria-labelledby="tableTitle"
            stickyHeader aria-label="sticky table"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >

                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <div name={row.id} style={{ display: '' }}>
                          {row.name}
                        </div>
                        <div name={row.id} style={{ display: 'none' }}>
                          <Input
                            type='text'
                            onChange={(e) => { setAccountName(e.target.value) }}
                            value={AccountName}
                            placeholder={row.name}
                          ></Input>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <div name={row.id} style={{ display: '' }}>
                          {row.email}
                        </div>
                        <div name={row.id} style={{ display: 'none' }}>
                          <Input
                            type='email'
                            onChange={(e) => { setAccountEmail(e.target.value) }}
                            value={AccountEmail}
                            placeholder={row.email}
                          ></Input>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
