import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import {browserHistory} from 'react-router-dom';
import {BrowserRouter as Router, Route, Redirect, Link} from 'react-router-dom'

import {makeStyles} from '@material-ui/core/styles';
import {Container, Paper, Typography, TextField, Button, IconButton, AppBar, Toolbar, Grid, Menu, MenuItem} from '@material-ui/core';
import {MenuIcon} from '@material-ui/icons/Menu';

import 'typeface-roboto';
import './index.css';


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(3, 2),
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    button: {
        margin: theme.spacing(1),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    paperButton: {
        textAlign: 'justify'
    },
    title: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const URL = "http://0.0.0.0:5000";

const Nav = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRedirect = (url) => event => {
        console.log(url);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        jiz
                    </Typography>
                    <Button aria-controls="navMenu"i aria-haspopup="true" onClick={handleClick}>
                        go to
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem><Button component={Link} to={"/"}>home</Button></MenuItem>
                        <MenuItem><Button component={Link} to={"/login"}>login</Button></MenuItem>
                        <MenuItem><Button component={Link} to={"/u/1"}>profile</Button></MenuItem>
                        <MenuItem><Button component={Link} to={"/ranking"}>ranking</Button></MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    );
};

const User = ({match}) => {
    const [user, setUser] = useState([]);
    const id = match.params.id;
    const classes = useStyles();

    useEffect(() => {
        getUser();
    }, []);

    async function getUser() {
        const r = await fetch(URL + "/u/" + id);
        const user = await r.json();
        const r2 = await fetch(URL + "/u/" + id + "/c");
        const content = await r2.json();
        
        let user_data = {
            user: user.data,
            content: content.data
        };

        setUser(user_data);
    }

    return ([
        <Nav />,
        <Container maxwidth="sm" classname="root">
            <Typography variant="h2" component="h2">
            Hi, <b>{user.user && user.user.username}</b>!
            </Typography>
            {user.content && user.content.map(c => (
                <Paper className={classes.root}>
                <Typography component="p">
                "{c.content}" - {new Date(c.created * 1000).toDateString()}, <i>{user.user.username}</i>
                </Typography>
                </Paper>
            ))}
        </Container>]
    );
};

const Ranking = () => {
    const [ranking, setRanking] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        getRanking();
    }, []);

    async function getRanking() {
        const r = await fetch(URL + "/r");
        const ranking = await r.json();
        setRanking(ranking.data);
    }


    return ([
        <Nav />,
        <Container maxwidth="sm">
        <Typography variant="h2" component="h2">Ranking</Typography>
        {ranking.map(r => (
            <div>
            <Paper className={classes.root}>
            <Typography variant="h5" component="h3">
            {r.score}
            </Typography>
            <Typography component="p">
            "{r.content}"
            - <i>{r.username}</i>
            </Typography>
            </Paper>
            <br></br>
            </div>
        ))}
        </Container>
    ]);
};

const Login = () => {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        username: "",
        password: "",
    });

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    const handleSubmit = () => event => {
        console.log(values);
        event.preventDefault();
    };

    return ([
        <Nav />,
        <Container maxWidth="sm">
        <Typography variant="h2" component="h2">Login</Typography>
        <form className={classes.container} onSubmit={handleSubmit()}>
            <TextField
                id="username"
                label="Name"
                className={classes.textField}
                onChange={handleChange("username")}
                margin="normal"
            />
            <TextField
                id="password"
                type="password"
                label="Password"
                className={classes.textField}
                onChange={handleChange("password")}
                margin="normal"
            />
            <Button label="Submit" type="submit" variant="contained" className={classes.button}>
                Login
            </Button>
        </form>
        </Container>
    ]);
};

const Home = () => {
    const [stack, setStack] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        getStack();
    }, []);

    async function getStack() {
        const r = await fetch(URL + "/u/1/s");
        const stack = await r.json();
        setStack(stack.data);
    }

    const handleChoice = (choice) => event => {
        event.preventDefault();
        console.log(`User selected: ${choice}`);
        
        const r_url = `${URL}/u/1/v`;

        axios.post(`${r_url}/${stack[choice].id}/1`)
            .then(data => console.log("OK:" + data))
            .catch(e => console.log("Error: " + e));
        
        const other = (choice == 0) ? 1 : 0;

        axios.post(`${r_url}/${stack[other].id}/0`)
            .then(data => console.log("OK:" + data))
            .catch(e => console.log("Error: " + e));
    };

    return ([
        <Nav />,
        <Container maxwidth="sm" className="root">
        <Typography variant="h2" component="h1">
        If u wanna get rich, u better vote bitx!
        </Typography>
        <br></br>
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
        >
            <Grid item xs>
                <Paper className={classes.paper} onClick={handleChoice(0)} component={Button} to={"/"}>
                    <Typography component="p">
                        <b>{stack[0] && stack[0].content}</b>
                        <br></br>
                        by <i>user_{stack[0] && stack[0].user_id}</i> 
                    </Typography>
                </Paper> 
            </Grid>
            <Grid item xs>
                <Paper className={classes.paper} onClick={handleChoice(1)} component={Button} to={"/"}>
                    <Typography component="p">
                        <b>{stack[1] && stack[1].content}</b> 
                        <br></br>
                        by <i>user_{stack[1] && stack[1].user_id}</i> 
                    </Typography>
                </Paper> 
            </Grid>
        </Grid>
    </Container>
    ]);
};

ReactDOM.render(
<Router>
    <Route exact path="/" component={Home}/>
    <Route path="/login" component={Login}/>
    <Route path="/register" component={Login}/>
    <Route path="/u/:id" component={User}/>
    <Route path="/ranking" component={Ranking}/>
</Router>,
document.getElementById('root')
);
