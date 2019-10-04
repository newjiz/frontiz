import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {browserHistory} from 'react-router';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'

import {makeStyles} from '@material-ui/core/styles';
import {Container, Paper, Typography, TextField, Button, IconButton, AppBar, Toolbar} from '@material-ui/core';
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
    title: {
        flexGrow: 1,
    },
}));

const URL = "http://localhost:5000";

const Nav = () => {
    const classes = useStyles();

    const handleRedirect = () => event => {
        console.log("Should redirect to '/'")
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        News
                    </Typography>
                    <Button onClick={handleRedirect()}>Login</Button>
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

const Root = () => {
    return (
        <Container maxwidth="sm" classname="root">
        <Typography variant="h1" component="h1">
        jizz
        </Typography>
        </Container>
    );
};

ReactDOM.render(
    <Router>
        <Route exact path="/" component={Login}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Login}/>
        <Route path="/u/:id" component={User}/>
        <Route path="/ranking" component={Ranking}/>
    </Router>,
    document.getElementById('root')
);
