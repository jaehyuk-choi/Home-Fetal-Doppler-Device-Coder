import * as React from 'react';
import { createCodebookUrl, createEditUrl, createTeamUrl } from '../frontendRoutes';
import { Card, CardActions, CardContent, Button, Typography, IconButton, Tooltip } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import EditIcon from '@mui/icons-material/Edit';
import BookIcon from '@mui/icons-material/Book';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import instance from '../api/instance';
import backendRoutes, { projectDeletePath } from '../backendRoutes';

export default function ProjectCard(props) {
    let project = props.project
    let userName = props.userName
    let setProjects = props.setProjects //function
    let projects = props.projects

    const navigate = useNavigate()

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [removeDocName, setRemoveDocName] = React.useState("");

    const handleRemoveProject = async (project) => {
        const owner = project?.owner
        const name = project?.name
        if (!owner || name === undefined || name === null) {
            alert("Cannot delete: project is missing owner or name.")
            return
        }
        try {
            const projectId = project._id || project.id
            const res = await instance.delete(projectDeletePath(owner, name, projectId))
            if (res.deletedCount === 1) {
                alert("Successfully removed project!")
                const newProjects = projects.slice(0)
                newProjects.splice(projects.indexOf(project), 1)
                setProjects(newProjects)
            } else {
                alert("Project not found in the database.")
            }
        } catch (err) {
            console.error(err)
            const msg = err.response?.data?.message || err.message || "Failed to remove project."
            alert(msg)
        }
    };

    const handleDialogOpen = (proj) => {
        setDialogOpen(true);
        setRemoveDocName(proj.name || "(unnamed project)");
    };

    const handleDialogClose = (remove, project) => {
        setDialogOpen(false);
        if (remove && userName == project.owner) {
            handleRemoveProject(project)
        } else if (userName != project.owner) {
            alert(`Only project owner ${project.owner}can remove this project.`)
        }
    };

    return (
        <Card sx={{ minWidth: 250, minHeight: 200 }}>
            <CardContent>
                <Tooltip title={project.name}>
                    <Typography variant="h3" component="div" noWrap>
                        {project.name || "(unnamed project)"}
                    </Typography>
                </Tooltip>

                <Typography variant="body1" sx={{ mb: 1.5, mt: 1 }} color="text.secondary">
                    Owner: {project.owner}
                </Typography>
                <Typography variant="body1">
                    Created: {project.create_time}
                </Typography>
                <Typography variant="body1">
                    {project.coding_level}
                </Typography>

            </CardContent>
            <CardActions disableSpacing>
                <Tooltip title="Edit">
                    <IconButton aria-label="edit" onClick={() => { navigate(createEditUrl(project.owner, project.name, userName)) }}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Compare">
                    <IconButton aria-label="compare" onClick={() => { navigate(createTeamUrl(project.owner, project.name, userName)) }}>
                        <CompareArrowsIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Codebook">
                    <IconButton aria-label="codebook" onClick={() => { navigate(createCodebookUrl(project.owner, project.name, userName)) }}>
                        <BookIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={() => handleDialogOpen(project)} >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>

            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Remove ${removeDocName}?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This will remove all contentes of this project.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDialogClose(false, project)}>Cancel</Button>
                    <Button onClick={() => handleDialogClose(true, project)} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Card >
    );
}
