import {Box, Button, Input, CircularProgress, IconButton} from '@mui/material';
import {useForm, useFieldArray} from 'react-hook-form';
import React, {useState} from 'react';
import {UserInputModel} from './models/UserInputModel';
import {metaDataService} from './services/metaDataService';
import {MetaDataModel} from './models/MetaDataModel';
import WebsiteCard from './components/WebsiteCard';
import Alert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import {Add} from '@mui/icons-material';

export function App() {
  const [metaData, setMetaData] = useState<MetaDataModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const {register, handleSubmit, control} = useForm<UserInputModel>({
    defaultValues: {
      urls: [{url: ''}],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'urls',
  });

  const onSubmit = (data: UserInputModel) => {
    setLoading(true);
    const urlList = data.urls.map((item) => item.url);
    metaDataService
      .getMetaData(urlList)
      .then((response) => {
        setMetaData(response);
        setLoading(false);
        setSuccess(true);
      })
      .catch((error) => {
        console.error('Error fetching metadata:', error);
        setLoading(false);
        setSuccess(false);
      });
  };

  return (
    <Box sx={{padding: '20px'}}>
      {success && <Alert severity="success">Data fetched successfully</Alert>}
      <h1>MetaData Getter 🔎</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{mb: 2, display: 'flex', alignItems: 'center'}}
          >
            <Input
              {...register(`urls.${index}.url` as const)}
              placeholder={`URL ${index + 1}`}
              defaultValue={field.url}
              fullWidth
              required
            />
            <IconButton
              onClick={() => remove(index)}
              color="error"
              sx={{ml: 1}}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '10px',
            mb: 2,
          }}
        >
          <Button
            color="success"
            variant="contained"
            onClick={() => append({url: ''})}
          >
            <Add />
            Add More
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={fields.length === 0}
          >
            Submit
          </Button>
          {loading && <CircularProgress />}
        </Box>
      </form>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          marginTop: '20px',
        }}
      >
        {metaData.map((item, index) => (
          <Box
            key={index}
            sx={{
              flex: '1 1 300px',
              boxSizing: 'border-box',
            }}
          >
            <WebsiteCard
              title={item.title}
              description={item.description}
              ogImage={item.ogImage}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default App;
