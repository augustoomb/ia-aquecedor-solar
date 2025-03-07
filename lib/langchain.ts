import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { TaskType } from "@google/generative-ai";

export const teste = async () => {
    try {
        const dataPath = "./data";
        const geminiAPI = process.env.GEMINI_API_KEY;

        // LOADER
        const directoryLoader = new DirectoryLoader(dataPath, {
            ".pdf": (path: string) => new PDFLoader(path),
        });

        const directoryDocs = await directoryLoader.load();



        // SPLITER
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const splitDocs = await textSplitter.splitDocuments(directoryDocs);



        // EMBEDDINGS
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: geminiAPI,
            taskType: TaskType.RETRIEVAL_DOCUMENT,
            modelName: "embedding-001", // Modelo de embedding gratuito do Google
        });

        console.log("chegou aqui sem erro")
    } catch (error) {
        console.log("ERRO!")
    }

}