
import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Moment from 'react-moment';
import { connect } from "react-redux";

import axios from 'axios';

const styles = theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});

const mapStateToProps = state => {
    return { currentNs: state.currentNs };
};

class Services extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            services: [],
        };
    }

    componentDidMount() {
        axios.get(`/api/namespace/${this.props.currentNs}/services`)
            .then(res => {
                this.setState({ services: res.data.body.items });
            });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.currentNs !== prevProps.currentNs) {
            this.componentDidMount();
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Grid>
                    <Typography variant="title" gutterBottom>
                        Services
                    </Typography>
                </Grid>
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>External Name</TableCell>
                                <TableCell>Ports</TableCell>
                                <TableCell>Created</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.services.map(s => {
                                return (
                                    <TableRow key={s.metadata.id}>
                                        <TableCell component="th" scope="row">
                                            {s.metadata.name}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {s.spec.type}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {s.spec.externalName}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {s.spec.ports && s.spec.ports[0].port}:{s.spec.ports && s.spec.ports[0].targetPort}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Moment fromNow>{s.metadata.creationTimestamp}</Moment>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

Services.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps)(Services));