import Navbar from '@/app/components/navbar';
import { fetchAnyAvailSession } from '@/app/actions';

export default async function MediaPage(params: any) {

    const result = await fetchAnyAvailSession('mediapage');
    const searchParams = params.searchParams;
    const animeName = searchParams.animeName;

    console.log(result);
    
    return (
        <div>
        <Navbar isAdmin={result.is_admin} onHome={false} onAdmin={false} onForums={false} />
        <h1>You are supposed to be watching: {animeName}</h1>
        </div>
    );
}