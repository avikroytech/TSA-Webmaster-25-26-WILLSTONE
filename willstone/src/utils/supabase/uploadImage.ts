import { supabase } from "@/utils/supabase/client";

async function uploadImage(file: File, resourceId: string) {
    const fileName = `${resourceId}/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
        .from("community-resources")
        .upload(fileName, file);
    
    if (error) {
        console.error("Upload error:", error);
        return null;
    }
    
    const { data: publicData } = supabase.storage
        .from("community-resources")
        .getPublicUrl(fileName);
    
    return publicData.publicUrl;
}