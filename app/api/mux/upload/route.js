import { NextResponse } from 'next/server';
import { supabase } from '@/app/services/supaBaseclient';
import Mux from '@mux/mux-node';

export async function POST(req) {
  try {
    // Process as FormData for file upload
    const formData = await req.formData();
    const videoFile = formData.get('video');
    const interviewId = formData.get('interviewId');
    
    if (!videoFile || !interviewId) {
      return NextResponse.json(
        { error: 'Missing video file or interview ID' },
        { status: 400 }
      );
    }
    
    // Convert to File object if it's not already
    const file = new File(
      [videoFile], 
      `interview-${interviewId}.webm`,
      { type: videoFile.type || 'video/webm' }
    );
    
    try {
      // Initialize Mux with environment variables
      const { Video } = new Mux();
      
      // Create a direct upload URL
      const upload = await Video.Uploads.create({
        cors_origin: '*',
        new_asset_settings: {
          playback_policy: 'public',
        }
      });
      
      // Return the upload URL and ID to the client
      const videoId = upload.id;
      const playbackId = upload.asset_id;
      
      // Store video metadata in Supabase
      const { data, error } = await supabase
        .from('interview_videos')
        .insert([
          {
            interview_id: interviewId,
            video_id: videoId,
            playback_id: playbackId,
            created_at: new Date().toISOString(),
          }
        ]);
        
      if (error) {
        console.error('Error storing video metadata:', error);
        return NextResponse.json(
          { error: 'Failed to store video metadata' },
          { status: 500 }
        );
      }
      
      // Update interview status
      await supabase
        .from('interviews')
        .update({ video_recorded: true })
        .eq('interview_id', interviewId);
      
      return NextResponse.json({ 
        success: true, 
        id: videoId, 
        playbackId 
      }, { status: 200 });
      
    } catch (uploadError) {
      console.error('Error uploading to MUX:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload video' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}