import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardMedia,
  TextareaAutosize,
  Grid,
  Typography,
  TextField,
  Button,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  IconButton
} from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Form } from '../../hooks/useForm';
import { createAddon, removeAddon, selectCourses } from '../../store/courses';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}));
export default function ImageManager({ recordForEdit }) {
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  const [image, setImage] = useState({ preview: '', data: '' });
  const [course, setCourse] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', course._id);
    formData.append('file', image.data);
    formData.append('title', title);
    formData.append('description', description);
    dispatch(createAddon(formData));
  };

  const handleFileChange = async (e) => {
    e.preventDefault();
    setImage({
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0]
    });
  };

  useEffect(() => {
    const match = courses.find((e) => e._id === recordForEdit._id);
    if (match) setCourse({ ...match });
  }, [courses]);

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container direction="column">
        <Grid container>
          <Grid container item direction="column" xs={6} sx={{ pr: 2 }}>
            <TextField
              name="title"
              label="title"
              value={title}
              size="small"
              sx={{ mb: 2 }}
              onChange={({ target }) => setTitle(target.value)}
            />
            <TextareaAutosize
              minRows={7}
              aria-label="empty textarea"
              placeholder="Empty"
              onChange={({ target }) => setDescription(target.value)}
            />

            <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }}>
              Submit
            </Button>
          </Grid>
          <Grid item xs={6}>
            <label htmlFor="contained-button-file">
              <input
                style={{ display: 'none' }}
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
                name="file"
                onChange={handleFileChange}
              />
              <Button variant="contained" component="span" sx={{ mb: 2 }}>
                Select Image
              </Button>
            </label>
            {image.preview && (
              <Card
                variant="outlined"
                sx={{
                  display: 'flex',
                  p: 1
                }}
              >
                <CardMedia
                  component="img"
                  width="100"
                  height="150"
                  alt="Category Icon"
                  src={image.preview}
                  sx={{
                    objectFit: 'contain'
                  }}
                />
              </Card>
            )}
          </Grid>
        </Grid>

        <Box
          sx={{ height: 400, width: 600, border: 1, p: 2, mb: 2 }}
          style={{
            overflow: 'hidden',
            overflowY: 'scroll' // added scroll
          }}
        >
          {course.addons &&
            course.addons.map((item) => (
              <Card sx={{ width: '100%', mb: 2 }}>
                <CardHeader
                  action={
                    <IconButton
                      aria-label="settings"
                      onClick={() => {
                        dispatch(removeAddon(course._id, item.id));
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  }
                  title={item.title}
                  subheader={item.date}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    {item.contents.length >= 1 &&
                      item.contents.map((item) => (
                        <CardMedia
                          key={item.id}
                          component="img"
                          height="300"
                          image={item.image}
                          sx={{
                            mb: 1,
                            objectFit: 'contain'
                          }}
                        />
                      ))}
                  </CardContent>
                </Collapse>
              </Card>
            ))}
        </Box>
      </Grid>
    </Form>
  );
}

ImageManager.propTypes = {
  recordForEdit: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired
};
