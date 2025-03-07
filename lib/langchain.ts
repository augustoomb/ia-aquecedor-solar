import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const teste = async () => {
    const dataPath = "./data";

    /* Load all PDFs within the specified directory */
    const directoryLoader = new DirectoryLoader(dataPath, {
        ".pdf": (path: string) => new PDFLoader(path),
    });

    const directoryDocs = await directoryLoader.load();

    // console.log(directoryDocs[0]);

    /* Additional steps : Split text into chunks with any TextSplitter. You can then use it as context or save it to memory afterwards. */
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.splitDocuments(directoryDocs);
    console.log(splitDocs[0]);
}