---
title: Machine Learning - ML Inferenc Platform
date: 2025-12-21
---

## Pre-Requisites to study (Don't spend more than 1 hour in each topic)

- Never go deep below content is enough for now.
- A model is just a function that learned from the data.
- AI engineering is about training a function, saving it, serving it safely, and scaling it cheaply.
- Every AI model used in production today is a form of machine learning model, specialized by the task it performs.
- **Types of Models** (I have only mentioned big ones others not for now).
  - Machine learning model (ML)
    1. Learns patterns from data.
    2. Outputs predictions.
    3. Examples - House price predictor, spam detector.
  - Large language model (LLM)
    1. Predicts next token.
    2. Transformer Architecture.
    3. Outputs probability distribution over words.
  - Speech to text model (STT)
    1. Uses specialized audio pre-processing.
    2. Uses encoder-only or encoder-decoder transformer architecture.
    3. Receives audio waveform -> converts to spectrogram -> encoder processes it -> decoder generates text tokens.
    4. Outputs text.
  - Text to speech model (TTS)
    1. Excat opposite of SST - this generates audio chunks.
    2. Uses encoder-decoder or diffusion based architecture.
    3. Receives text -> encoder process it -> decoder generates mel-spectogram -> vocoder converts into audio waveform.
    4. Outputs audio.
- **Architectures**
  - Linear / Tree for classical ML.
  - Convolutional Neural Network (CNN) for Images spatial data.
  - Recurrent Neural Network (RNN) for text, time series sequential data.
  - Transformer for Text, audio and vision.
  - Encoder-Decoder for Translations.
- **ML Frameworks**
  - Scikit-learn - Classical ML.
  - PyTorch - Deep learning.
  - TensorFlow - Deep learning.
  - XGBoost - Tree-based learning.
- **The ML Pipeline**
  - During training, a model learns weights from data.
  - These learned weights are saved as a model artifact (binary file).
  - During inference, the artifact is loaded into an inference service.
  - An API sends requests to the inference service.
  - The model processes the input using its learned weights and returns predictions.
  - Monitoring, scaling, and deployment safety exist around this process.
- At its core, AI is applied mathematics, but AI engineering is about building reliable systems around models.

## Minimum Requirments

- **Hardware**
  - ThinkPad Laptop (Intel i5-1600U @ 2.40GHz 8GB RAM 240GB ROM 64-bit).
  - Charger.
  - Note and Pen.
- **Software**
  - Docker.
  - Python.
  - Jupyter Notebook.
  - VS Code.
  - Git.
  - Kibana.
  - scikit learn.
