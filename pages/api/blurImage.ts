import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import { getPlaiceholder } from 'plaiceholder';
import fetch from "node-fetch";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const { imageUrl } = req.query;

    try {
        const response = await fetch(imageUrl as string);
        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);

        const blurredImageBuffer = await sharp(imageBuffer)
            .blur()
            .toBuffer();

        const { base64 } = await getPlaiceholder(blurredImageBuffer);
        res.status(200).json({ base64 });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}