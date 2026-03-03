import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('screenshots')
export class ScreenshotsController {
  /**
   * Serve screenshot image by filename
   * GET /screenshots/image/:filename
   */
  @Get('image/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    try {
      // Decode the filename (in case it has special characters)
      const decodedFilename = decodeURIComponent(filename);
      
      // Search for the file in all category folders
      const baseDir = path.join(process.env.HOME || '', 'Desktop', 'Screenshots');
      const categories = ['Code', 'Errors', 'Chat', 'UI', 'Documents', 'Other'];
      
      for (const category of categories) {
        const filePath = path.join(baseDir, category, decodedFilename);
        
        if (fs.existsSync(filePath)) {
          // Set proper content type
          const ext = path.extname(filePath).toLowerCase();
          const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
          
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
          
          // Stream the file
          const fileStream = fs.createReadStream(filePath);
          fileStream.pipe(res);
          return;
        }
      }
      
      // File not found
      throw new NotFoundException(`Screenshot not found: ${decodedFilename}`);
    } catch (error) {
      throw new NotFoundException(`Failed to load screenshot: ${error.message}`);
    }
  }
}
