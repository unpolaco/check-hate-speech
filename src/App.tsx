import React, { useState } from "react";
import * as toxicity from "@tensorflow-models/toxicity";
import * as tf from "@tensorflow/tfjs";
import {
  Container,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Form, FormikProvider, FormikValues, useFormik } from "formik";
import { MessageBox } from "./components/MessageBox";

export const App = () => {
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const onSubmit = () => {
    checkComment(values.textInput);
  };
  
  const formik = useFormik<FormikValues>({
    initialValues: { textInput: "" },
    onSubmit,
  });

  const { values, setFieldValue } = formik;
  const threshold = 0.7;
  const replaceUndercore = (text: string) => text.replace(/_/g, " ")
  const checkComment = async (text: string) => {
    setShowMessage(true)
    setWarnings([]);
    setIsChecking(true);
    await toxicity.load(threshold, []).then((model) => {
      const sentences = [text];
      model.classify(sentences).then((predictions) => {
        console.log(predictions);
        const truePredictions: string[] = [];
        predictions.forEach((prediction) => {
          if (prediction.results[0].match) {
            truePredictions.push(replaceUndercore(prediction.label));
          }
        });
        setWarnings(truePredictions);
        setIsChecking(false);
        console.log("Using TensorFlow backend: ", tf.getBackend());
      });
    });
  };

  return (
    <FormikProvider value={formik}>
      <Form>
        <Container
          maxWidth="xs"
          style={{ display: "flex", flexDirection: "column", marginTop: 100 }}
        >
          <Typography component="h1" variant="h6">
            Leave your comment here
          </Typography>
          <TextareaAutosize
            style={{
              marginBottom: 10,
              fontSize: 18,
              padding: 12,
            }}
            id="textInput"
            name="textInput"
            placeholder="Write something here..."
            value={values.textInput}
            onChange={(e) => setFieldValue("textInput", e.target.value)}
          />
          <LoadingButton
            loading={isChecking}
            loadingIndicator="Veryfing..."
            variant="contained"
            type="submit"
          >
            Submit
          </LoadingButton>

          {!isChecking && showMessage && <MessageBox warnings={warnings}/>}
        </Container>
      </Form>
    </FormikProvider>
  );
};
