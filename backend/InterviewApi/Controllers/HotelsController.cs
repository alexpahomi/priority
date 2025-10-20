using Microsoft.AspNetCore.Mvc;
using InterviewApi.Models;
using InterviewApi.Services;

namespace InterviewApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HotelController : ControllerBase
{
    /// <summary>
    /// Get all hotels
    /// </summary>
    [HttpGet]
    public ActionResult<List<Hotel>> GetHotels()
    {
        var hotels = DataService.ReadHotelsFromJson();
        return Ok(hotels);
    }
}

