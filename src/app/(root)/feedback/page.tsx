
import DiscussionForum from '@/components/comment-section/comment-show';
import { Card } from '@/components/ui/card';


export default function FeedbackPage() {


  return (
    <div className="container-fluid mx-auto p-6 pt-[90px]">
      <h1 className="text-xl md:text-3xl font-semibold">Share your feedback </h1>
      <div className='px-4 sm:px-8'>
      <Card className="p-6 shadow-xl space-y-4 mt-[10px] mb-[30px]">
        <h2 className="text-2xl font-medium">🛠️ Recent Updates</h2>
        <div className="mt-6 space-y-4 text-lg text-gray-700">
  <p>🚀 <strong>New Features on CP Cheats – Built for You!</strong></p>

  <p>💻 <strong>Advanced Code Editor:</strong> Experience seamless coding with our multi-language code editor. Write, run, and debug code in real-time across languages like Python, JavaScript, C++, and more!</p>

  <p>📊 <strong>Algorithm Visualization:</strong> Bring your algorithms to life with step-by-step visualizations. Watch your code execute and understand complex logic like never before.</p>

  <p>📝 <strong>Read and Write Interview Questions:</strong> Explore a vast collection of real interview questions across top tech companies. Share your own interview experiences and help the community prepare better!</p>

  <p>📋 <strong>Interview Analyzer:</strong> Get company-wise interview questions and analyze frequently asked problems. Prepare smarter and stay ahead in your coding interviews.</p>

  <p>💡 <strong>Your Feedback Matters!</strong> We&apos;re constantly improving CP Cheats to make your experience better. Share your thoughts below and help us shape the future of competitive programming!</p>
</div>



      </Card>
      </div>

    <DiscussionForum initialPostId={"userfeedbacks"} limitcomment={50}/>
 

    </div>
  );
}
