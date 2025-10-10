import { supabase } from '@/app/services/supaBaseclient';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { interviewId, videoId, playbackId } = await req.json();
    
    if (!interviewId || !videoId || !playbackId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
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
    
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Mux API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
