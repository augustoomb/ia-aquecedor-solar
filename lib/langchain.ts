import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { TaskType } from "@google/generative-ai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

export const retrieveContext = async (question: string) => {
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




        // VECTOR STORE IN MEMORY
        // const vectorStore = new MemoryVectorStore(embeddings);


        // VECTOR STORE
        const vectorStore = new FaissStore(embeddings, {});


        await vectorStore.addDocuments(splitDocs);

        const results = await vectorStore.similaritySearch(
            question
        );


        const context = results.map(doc => doc.pageContent).join("\n\n");

        return context;
    } catch (error) {
        console.log("Erro langchain:", error);
        return "Erro ao recuperar contexto";
    }

}